const vscode = acquireVsCodeApi();

export const postToExtension = ({ type = '', payload = {}, reAction = false }) => {
  if (type) vscode.postMessage({ type, payload });
};
