export const AUTH_TYPE = {
  GITHUB: 'github',
  BITBUCKET: 'bitbucket',
};

export const MESSAGE_TYPE = {
  // Auth request message types
  AUTH_REQUEST: 'authRequest',
  AUTH_SUCCESS: 'authSuccess',
  AUTH_ERROR: 'authError',

  // Commits request message types
  FETCH_COMMITS_REQUEST: 'fetchCommitsRequest',
  FETCH_COMMITS_SUCCESS: 'fetchCommitsSuccess',
  FETCH_COMMITS_ERROR: 'fetchCommitsError',

  // Fetch Branch details message types
  FETCH_BRANCH_REQUEST: 'fetchBranchRequest',
  FETCH_BRANCH_SUCCESS: 'fetchBranchSuccess',
  FETCH_BRANCH_ERROR: 'fetchBranchError',

  // Cherry Pick message types
  CHERRY_PICK_REQUEST: 'cherryPickRequest',
  CHERRY_PICK_SUCCESS: 'cherryPickSuccess',
  CHERRY_PICK_ERROR: 'cherryPickError',
};

export const GIT_LABEL = {
  GITHUB: 'GitHub',
  BITBUCKET: 'BitBucket',
};

export const TOKEN_EXPIRY_BUFFER = 60 * 1000;
export const BITBUCKET_TOKEN_KEY = 'bitbucketToken';
export const GITHUB_TOKEN_KEY = 'githubToken';
export const CLIENT_ID = 'dFYtPv8cv2dUyBYvvT';
export const CLIENT_SECRET = '9dvgWJZDNUEm6cptmjhXz8cs6sYLjnbw';
export const REDIRECT_URI = 'vscode://jayveer-sodha.autocherry/auth-callback';
