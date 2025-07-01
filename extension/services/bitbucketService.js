const vscode = require('vscode');
const { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET, AUTH_TYPE, BITBUCKET_TOKEN_KEY } = require('../../shared/constants');
const { generateState, stateCache, getBitbucketAuthUrl, getGitAPI, isCachedTokenAvailable } = require('../utils/commonUtils');

class BitbucketAuth {
  #resolve = null;
  #reject = null;
  #authPromise = null;

  async startAuthFlow() {
    const state = generateState();
    stateCache.set(state, true);

    const authUrl = getBitbucketAuthUrl(CLIENT_ID, REDIRECT_URI, state);
    vscode.env.openExternal(vscode.Uri.parse(authUrl));

    this.#authPromise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;

      setTimeout(() => {
        if (this.#reject) {
          this.#reject(new Error('Auth timed out'));
          this.#cleanup();
        }
      }, 30000);
    });

    return this.#authPromise;
  }

  async handleCallback(uri) {
    const query = new URLSearchParams(uri.query);
    const code = query.get('code');
    const state = query.get('state');

    if (!code || !state || !stateCache.has(state)) {
      if (this.#reject) {
        this.#reject(new Error('Invalid or expired Bitbucket auth request.'));
        this.#cleanup();
      }
      return;
    }

    stateCache.delete(state);

    if (this.#resolve) {
      this.#resolve(code);
      this.#cleanup();
    }
  }

  async exchangeToken(code) {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    console.warn('Basic token:', basicAuth);
    try {
      const res = await fetch('https://bitbucket.org/site/oauth2/access_token', {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + basicAuth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Token exchange failed: ' + errText);
      }

      const rawTokenData = await res.json();
      const tokenData = {
        ...rawTokenData,
        created_at: Date.now(),
      };

      return tokenData;
    } catch (error) {
      console.warn({ error });
    }
  }

  #cleanup() {
    this.#resolve = null;
    this.#reject = null;
    this.#authPromise = null;
  }
}

class BitbucketRepoService {
  constructor(token) {
    this.token = token;
    this.owner = null;
    this.repoSlug = null;
    this.repo = null;
    this.remoteUrl = null;
    this.currentBranch = null;
    this.provider = AUTH_TYPE.BITBUCKET;
  }

  static async connect(context) {
    const token = await getBitbucketToken(context);
    const instance = new BitbucketRepoService(token);
    await instance.setBaseData();
    return instance;
  }

  async setBaseData() {
    const git = await getGitAPI();
    if (!git) throw new Error('Git API not available.');

    this.repo = git.repositories[0] || null;
    this.remoteUrl = this.repo?.state?.remotes[0]?.fetchUrl || null;
    this.currentBranch = this.repo?.state?.HEAD?.name || null;

    this.setRepoDetails();
    return this;
  }

  setRepoDetails() {
    if (/bitbucket.*[:/]/.test(this.remoteUrl)) {
      const match = this.remoteUrl.match(/[:/]([^:/]+)\/([^/]+?)(\.git)?$/);
      if (match) {
        this.owner = match[1];
        this.repoSlug = match[2];
      }
    }
  }

  async fetchPRDetails(prId) {
    const url = `https://api.bitbucket.org/2.0/repositories/${this.owner}/${this.repoSlug}/pullrequests/${prId}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch PR details: ${errText}`);
    }

    return await res.json();
  }

  async getCommitsByPullRequestId(prId) {
    if (!this.owner || !this.repoSlug) {
      throw new Error('Repository details are not set.');
    }

    const url = `https://api.bitbucket.org/2.0/repositories/${this.owner}/${this.repoSlug}/pullrequests/${prId}/commits`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch commits: ${res.status} ${errText}`);
      }

      const data = await res.json();

      const commits = data.values.map(commit => ({
        sha: commit.hash,
        message: commit.message,
        author: commit.author?.user?.display_name || '',
        date: commit.date,
      }));

      return commits;
    } catch (error) {
      console.error('Error fetching commits:', error.message);
      throw new Error('Unable to fetch pull request commits.');
    }
  }

  async fetchPullRequestWithCommits(prId) {
    const [prDetails, prCommits] = await Promise.all([this.fetchPRDetails(prId), this.getCommitsByPullRequestId(prId)]);

    return { prDetails, prCommits };
  }

  async isBranchAvailableAndNotMerged(branchName) {
    // 1. Check branch existence
    const branchUrl = `https://api.bitbucket.org/2.0/repositories/${this.owner}/${this.repoSlug}/refs/branches/${branchName}`;
    const branchRes = await fetch(branchUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (branchRes.status === 404) {
      throw new Error(`Branch "${branchName}" does not exist.`);
    }

    if (!branchRes.ok) {
      const errText = await branchRes.text();
      throw new Error(`Failed to check branch: ${errText}`);
    }

    // 2. Check if branch has a merged PR
    const prUrl = `https://api.bitbucket.org/2.0/repositories/${this.owner}/${this.repoSlug}/pullrequests?q=source.branch.name="${branchName}"`;
    const prRes = await fetch(prUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const prData = await prRes.json();

    if (prData.values && prData.values.some(pr => pr.state === 'MERGED')) {
      throw new Error(`Branch "${branchName}" has already been merged.`);
    }

    return true; // exists and not merged
  }
}
const bitbucketAuth = new BitbucketAuth();

async function getBitbucketToken(context) {
  if (!isCachedTokenAvailable(BITBUCKET_TOKEN_KEY, context)) {
    const code = await bitbucketAuth.startAuthFlow();
    const tokenData = await bitbucketAuth.exchangeToken(code);
    await context.globalState.update(BITBUCKET_TOKEN_KEY, tokenData);
    console.warn('[Bitbucket] Token acquired:', tokenData);
    return tokenData.access_token;
  }

  return context.globalState.get(BITBUCKET_TOKEN_KEY).access_token;
}

module.exports = { bitbucketAuth, BitbucketRepoService, getBitbucketToken };
