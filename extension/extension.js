const vscode = require('vscode');

function activate(context) {
  console.log('Congratulations, your extension "autocherry" is now active!');

  const disposable = vscode.commands.registerCommand('autocherry.helloWorld', function () {
    vscode.window.showInformationMessage('Hello World from AutoCherry!');
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
