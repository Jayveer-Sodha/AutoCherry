const vscode = acquireVsCodeApi();

export const postToExtension = ({ type = '', payload = {} }) => {
  if (type) vscode.postMessage({ type, payload });
};
