const { sendToWebview } = require('./webviewHandler');
const { GithubService } = require('../services/githubService');
const { MESSAGE_TYPE, AUTH_TYPE } = require('../../shared/constants');
const { BitbucketRepoService } = require('../services/bitbucketService');

async function commitsHandler({ prId, provider, context, webview }) {
  try {
    const service =
      provider === AUTH_TYPE.GITHUB
        ? await GithubService.connect()
        : provider === AUTH_TYPE.BITBUCKET
        ? await BitbucketRepoService.connect(context)
        : null;

    if (!service) throw new Error(`Unsupported provider: ${provider}`);

    const { prDetails, prCommits } = await service.fetchPullRequestWithCommits(prId);

    console.warn('[commitsHandler] ✅ Fetched PR commits', { prDetails });

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_COMMITS_SUCCESS,
      payload: { prDetails, prCommits },
    });
  } catch (err) {
    console.error('[commitsHandler] ❌ Commit fetch failed:', err.message);
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_COMMITS_ERROR,
      payload: {
        provider,
        commits: [],
        prId,
        error: { key: 'Message : ', value: err.message },
      },
    });
  }
}

module.exports = { commitsHandler };
