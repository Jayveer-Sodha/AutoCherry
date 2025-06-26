const vscode = require('vscode');

//  Loads and returns webview HTML with asset paths rewritten to use webview-safe URIs.
async function loadWebview(webview, context, htmlPath, assetsRoot = 'assets') {
  const distFolder = vscode.Uri.joinPath(context.extensionUri, htmlPath);
  const htmlFile = vscode.Uri.joinPath(distFolder, 'index.html');

  const htmlBuffer = await vscode.workspace.fs.readFile(htmlFile);
  let html = htmlBuffer.toString();
  const assetsUri = webview.asWebviewUri(vscode.Uri.joinPath(distFolder, assetsRoot));
  html = html.replace(/(["'(])\.\/assets\//g, `$1${assetsUri.toString()}/`);

  return html;
}

//  Prepares and loads the HTML content into the webview
async function initializeWebview({ webviewView, context, htmlPath, assetsRoot = 'assets', onMessage }) {
  const webview = webviewView.webview;

  webview.options = {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, htmlPath)],
  };

  const html = await loadWebview(webview, context, htmlPath, assetsRoot);
  webview.html = html;

  if (onMessage) {
    webview.onDidReceiveMessage(msg => onMessage(msg, webview));
  }
}

function sendToWebview({ type = '', payload = {}, webview }) {
  webview.postMessage({ type, payload });
}

module.exports = { initializeWebview, sendToWebview };
