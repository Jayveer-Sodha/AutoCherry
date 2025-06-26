const { AUTH_TYPE, MESSAGE_TYPE } = require('../../shared/constants');
const { sendToWebview } = require('./webviewHandler');

function authRequest({ provider, webview, context }) {
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
    setTimeout(() => {
      sendToWebview({
        webview,
        type: MESSAGE_TYPE.AUTH_ERROR,
        payload: {
          provider: AUTH_TYPE.BITBUCKET,
          error: { message: 'Failed to connect with bitbucket' },
        },
      });
    }, 1000);
  }
}

module.exports = { authRequest };
