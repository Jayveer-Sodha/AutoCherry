const vscode = require('vscode');
const { authRequest } = require('./authHandler');
const { branchHandler } = require('./branchHandler');
const { commitsHandler } = require('./commitsHandler');
const { MESSAGE_TYPE } = require('../../shared/constants');
const { getRepoProvider } = require('../utils/commonUtils');
const { cherryPickHandler } = require('./cherryPickHandler');

function handleWebviewMessage(message, webview, context) {
  const { type, payload } = message;

  if (type === MESSAGE_TYPE.RELOAD_APP) {
    return vscode.commands.executeCommand('workbench.action.reloadWindow');
  }

  if (type === MESSAGE_TYPE.PROVIDER_REQUEST) {
    return getRepoProvider({ webview });
  }

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
