const { authRequest } = require('./authHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');
const { fetchCommitsHandler, fetchBranchDetailsHandler, cherryPickCommits } = require('./gitHandler');

function handleWebviewMessage(message, webview, context) {
  const { type, payload } = message;
  if (type === MESSAGE_TYPE.AUTH_REQUEST) {
    return authRequest({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.FETCH_COMMITS_REQUEST) {
    return fetchCommitsHandler({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.FETCH_BRANCH_REQUEST) {
    return fetchBranchDetailsHandler({ ...payload, webview, context });
  }

  if (type === MESSAGE_TYPE.CHERRY_PICK_REQUEST) {
    return cherryPickCommits({ ...payload, webview, context });
  }
}

module.exports = { handleWebviewMessage };
