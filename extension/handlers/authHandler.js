const { sendToWebview } = require('./webviewHandler');
const { getRepoContext } = require('../utils/commonUtils');
const { getGithubToken } = require('../services/githubService');
const { AUTH_TYPE, MESSAGE_TYPE } = require('../../shared/constants');
const { getBitbucketToken } = require('../services/bitbucketService');

async function authRequest({ provider, webview, context }) {
  try {
    const { provider: actualProvider } = await getRepoContext();

    if (provider !== actualProvider) {
      throw new Error(`Provider mismatch: current repo is on "${actualProvider}", but request was for "${provider}".`);
    }

    let token;

    if (provider === AUTH_TYPE.GITHUB) {
      token = await getGithubToken();
      if (!token) throw new Error('GitHub token not found.');
    } else if (provider === AUTH_TYPE.BITBUCKET) {
      token = await getBitbucketToken(context);
      if (!token) throw new Error('Bitbucket token not found.');
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.AUTH_SUCCESS,
      payload: { provider },
    });
  } catch (error) {
    sendToWebview({
      webview,
      type: MESSAGE_TYPE.AUTH_ERROR,
      payload: {
        provider,
        authData: {
          error: { message: error.message },
        },
      },
    });
  }
}

module.exports = { authRequest };
