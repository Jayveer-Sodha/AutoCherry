const { authRequest } = require('./authHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');

function handleWebviewMessage(message, webview, context) {
  const { type, payload } = message;
  if (type === MESSAGE_TYPE.AUTH_REQUEST) {
    return authRequest({ ...payload, webview, context });
  }
}

module.exports = { handleWebviewMessage };
