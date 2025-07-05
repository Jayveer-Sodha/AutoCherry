const vscode = require('vscode');
const { bitbucketAuth } = require('./services/bitbucketService');
const { CherryPickerViewProvider } = require('./views/cherrypickerView');

async function activate(context) {
  // 1. Register your webview
  const provider = new CherryPickerViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('cherrypickerView', provider));

  // 2. Register URI handler for OAuth redirect
  const uriHandler = {
    handleUri(uri) {
      bitbucketAuth.handleCallback(uri, context.globalState);
    },
  };

  context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
}

module.exports = { activate };
