const vscode = require('vscode');
const { Octokit } = require('@octokit/rest');
const { getRepoContext } = require('../utils/commonUtils');
const { AUTH_TYPE } = require('../../shared/constants');

class GithubService {
  constructor(token) {
    this.token = token;
    this.currentBranch = '';
    this.owner = '';
    this.provider = AUTH_TYPE.GITHUB;
    this.repo = null;
    this.repoSlug = '';
    this.remoteUrl = '';
  }

  static async connect() {
    const token = await getGithubToken();
    const instance = new GithubService(token);
    await instance.setBaseData();
    return instance;
  }

  async setBaseData() {
    const { currentBranch, owner, provider, remoteUrl, repo, repoSlug } = await getRepoContext();
    Object.assign(this, {
      repo,
      owner,
      provider,
      repoSlug,
      remoteUrl,
      currentBranch,
    });
  }

  async fetchPRDetails(prId) {
    const octokit = new Octokit({ auth: this.token });

    try {
      const { data: pr } = await octokit.pulls.get({
        owner: this.owner,
        repo: this.repoSlug,
        pull_number: prId,
      });

      return {
        id: pr.number,
        title: pr.title,
        head: pr.head.ref,
        base: pr.base.ref,
        user: pr.user.login,
        createdAt: pr.created_at,
        url: pr.html_url,
      };
    } catch (err) {
      console.error(`❌ Failed to fetch PR #${prId}:`, err);
      return [];
    }
  }
  async fetchPRCommits(prId) {
    const octokit = new Octokit({ auth: this.token });

    try {
      const { data: commits } = await octokit.pulls.listCommits({
        owner: this.owner,
        repo: this.repoSlug,
        pull_number: prId,
      });

      return commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
      }));
    } catch (err) {
      console.error(`❌ Failed to fetch commits for PR #${prId}:`, err);
      return [];
    }
  }

  async fetchPullRequestWithCommits(prId) {
    const [prDetails, prCommits] = await Promise.all([this.fetchPRDetails(prId), this.fetchPRCommits(prId)]);

    return { prDetails, prCommits };
  }

  async isBranchAvailableAndNotMerged(branchName) {
    const octokit = new Octokit({ auth: this.token });

    try {
      await octokit.repos.getBranch({
        owner: this.owner,
        repo: this.repoSlug,
        branch: branchName,
      });

      // Branch exists
      return true;
    } catch (err) {
      if (err.status === 404) {
        // Branch does NOT exist
        return false;
      }

      console.error(`❌ Failed to check branch "${branchName}":`, err);
      throw err;
    }
  }
}

async function getGithubToken() {
  try {
    const session = await vscode.authentication.getSession('github', ['repo'], { createIfNone: true });
    return session.accessToken || null;
  } catch (error) {
    console.error('GitHub auth failed', error);
    throw new Error(error);
  }
}

module.exports = { GithubService, getGithubToken };
