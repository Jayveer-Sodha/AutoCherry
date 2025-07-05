export const AUTH_TYPE = {
  GITHUB: 'github',
  BITBUCKET: 'bitbucket',
};

export const MESSAGE_TYPE = {
  RELOAD_APP: 'reload',
  // Provider request message types
  PROVIDER_REQUEST: 'providerRequest',
  PROVIDER_SUCCESS: 'providerSuccess',
  PROVIDER_ERROR: 'providerError',

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
export const CLIENT_ID = 'Kp8Z4TqpWvkmU43Puq';
export const REDIRECT_URI = 'vscode://jayveersodha.cherrypicker/auth-callback';
export const WEB_TOKEN_URL = 'https://www.jayveerx.com/api/exchange-token';
