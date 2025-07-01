const { authRequest } = require('./authHandler');
const { branchHandler } = require('./branchHandler');
const { commitsHandler } = require('./commitsHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');
const { cherryPickHandler } = require('./cherryPickHandler');

function handleWebviewMessage(message, webview, context) {
  const { type, payload } = message;
  if (type === MESSAGE_TYPE.AUTH_REQUEST) {
    return authRequest({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.FETCH_COMMITS_REQUEST) {
    return commitsHandler({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.FETCH_BRANCH_REQUEST) {
    return branchHandler({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.CHERRY_PICK_REQUEST) {
    return cherryPickHandler({ ...payload, webview, context });
  }
}

module.exports = { handleWebviewMessage };
