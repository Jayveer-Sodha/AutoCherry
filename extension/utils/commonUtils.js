const vscode = require('vscode');
const { default: simpleGit } = require('simple-git');
const { TOKEN_EXPIRY_BUFFER } = require('../../shared/constants');

const stateCache = new Map();

function generateState() {
  return Math.random().toString(36).substring(2);
}

function getBitbucketAuthUrl(clientId, redirectUri, state) {
  const scopes = ['account', 'repository', 'repository:write', 'pullrequest:write'].join(' ');

  const encodedScopes = encodeURIComponent(scopes);
  const encodedRedirectUri = encodeURIComponent(redirectUri);

  return `https://bitbucket.org/site/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirectUri}&scope=${encodedScopes}&state=${state}`;
}

function isTokenValid(token) {
  if (!token || !token.access_token || !token.expires_in) {
    return false;
  }

  const expiresAt = token.created_at + token.expires_in * 1000;
  const now = Date.now();

  return now < expiresAt - TOKEN_EXPIRY_BUFFER;
}

function isCachedTokenAvailable(providerKey, context) {
  const tokenData = context.globalState.get(providerKey);
  return isTokenValid(tokenData);
}

async function getGitAPI() {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) return null;
  const git = await gitExtension.activate();
  return git.getAPI(1);
}

async function waitForRepository(gitAPI, timeout = 5000) {
  const start = Date.now();
  while (gitAPI.repositories.length === 0) {
    if (Date.now() - start > timeout) return null;
    await new Promise(r => setTimeout(r, 500));
  }
  return gitAPI.repositories[0];
}

async function getRemoteUrl(repoPath) {
  const git = simpleGit(repoPath);
  const remotes = await git.getRemotes(true);
  const origin = remotes.find(r => r.name === 'origin');
  return origin?.refs.fetch || null;
}

function getBranchUrl(remoteUrl, branch, provider) {
  if (provider === 'github') {
    const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      const [, owner, repo] = match;
      return `https://github.com/${owner}/${repo}/tree/${branch}`;
    }
  }

  if (provider === 'bitbucket') {
    const match = remoteUrl.match(/@[^:]+:([^/]+)\/(.+?)(\.git)?$/);
    if (match) {
      const [, workspace, repo] = match;
      return `https://bitbucket.org/${workspace}/${repo}/branch/${branch}`;
    }
  }

  return null;
}

async function getRepoPath() {
  const gitAPI = await getGitAPI();
  if (!gitAPI) return null;

  // Wait for repo to load (already in your code)
  const repo = await waitForRepository(gitAPI);
  if (!repo) return null;

  // Here's the full path to the local repo
  return repo.rootUri.fsPath;
}

module.exports = { stateCache, generateState, getBitbucketAuthUrl, isTokenValid, isCachedTokenAvailable, getRepoPath, getBranchUrl, getRemoteUrl };
