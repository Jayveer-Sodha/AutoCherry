const { handleWebviewMessage } = require('../handlers/messageHandler');
const { initializeWebview } = require('../handlers/webviewHandler');

class AutoCherryViewProvider {
  constructor(context) {
    this.context = context;
  }

  async resolveWebviewView(webviewView) {
    await initializeWebview({
      webviewView,
      context: this.context,
      htmlPath: 'webview/dist',
      assetsRoot: 'assets',
      onMessage: (msg, webview) => handleWebviewMessage(msg, webview, this.context),
    });
  }
}

module.exports = { AutoCherryViewProvider };
