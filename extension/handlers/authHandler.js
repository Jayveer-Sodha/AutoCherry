const { sendToWebview } = require('./webviewHandler');
const { bitbucketAuth } = require('../services/bitbucketService');
const { isCachedTokenAvailable } = require('../utils/commonUtils');
const { AUTH_TYPE, MESSAGE_TYPE, BITBUCKET_TOKEN_KEY } = require('../../shared/constants');

async function authRequest({ provider, webview, context }) {
  if (provider === AUTH_TYPE.GITHUB) {
    setTimeout(() => {
      sendToWebview({
        webview,
        type: MESSAGE_TYPE.AUTH_SUCCESS,
        payload: {
          provider: AUTH_TYPE.GITHUB,
        },
      });
    }, 1000);
  }

  if (provider === AUTH_TYPE.BITBUCKET) {
    if (!isCachedTokenAvailable(BITBUCKET_TOKEN_KEY, context)) {
      const code = await bitbucketAuth.startAuthFlow();
      const tokenData = await bitbucketAuth.exchangeToken(code);
      context.globalState.update(BITBUCKET_TOKEN_KEY, tokenData);
      console.warn({ tokenData });
    }

    sendToWebview({
      webview,
      type: MESSAGE_TYPE.AUTH_SUCCESS,
      payload: {
        provider: AUTH_TYPE.BITBUCKET,
      },
    });
  }
}

module.exports = { authRequest };
