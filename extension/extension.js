const vscode = require('vscode');
const { bitbucketAuth } = require('./services/bitbucketService');
const { AutoCherryViewProvider } = require('./views/autoCherryView');

async function activate(context) {
  // 1. Register your webview
  const provider = new AutoCherryViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('autoCherryView', provider));

  // 2. Register URI handler for OAuth redirect
  const uriHandler = {
    handleUri(uri) {
      console.log('[OAuth] URI received:', uri.toString());
      bitbucketAuth.handleCallback(uri, context.globalState);
    },
  };

  context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));
}

module.exports = { activate };
