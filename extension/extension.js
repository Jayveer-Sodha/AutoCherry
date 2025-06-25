const vscode = require('vscode');
const { AutoCherryViewProvider } = require('./views/autoCherryView');

async function activate(context) {
  // 1. Register your webview
  const provider = new AutoCherryViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('autoCherryView', provider));
}

module.exports = { activate };
