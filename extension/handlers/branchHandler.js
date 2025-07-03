const { sendToWebview } = require('./webviewHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');
const { GithubService } = require('../services/githubService');
const { BitbucketRepoService } = require('../services/bitbucketService');

async function branchHandler({ branchName, provider, context, webview }) {
  try {
    let isBranchAvailable = false;

    if (provider === 'bitbucket') {
      const service = await BitbucketRepoService.connect(context);
      isBranchAvailable = await service.isBranchAvailableAndNotMerged(branchName);
    } else if (provider === 'github') {
      const service = await GithubService.connect();
      isBranchAvailable = await service.isBranchAvailableAndNotMerged(branchName);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_BRANCH_SUCCESS,
      payload: {
        isBranchAvailable,
        branchName,
      },
    });
  } catch (error) {
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.FETCH_BRANCH_ERROR,
      payload: {
        error: { key: 'Message : ', value: error.message },
      },
    });
  }
}

module.exports = { branchHandler };
