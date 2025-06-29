import { MESSAGE_TYPE } from '../../../shared/constants';
import { useEffect, useState, createContext } from 'react';

export const MessageContext = createContext();

export const initialLoadingState = {
  github: false,
  bitbucket: false,
  fetchCommitsCTA: false,
  searchBranchCTA: false,
};

export const initialPullRequestState = {
  details: null,
  commits: [],
  selectedCommits: [],
  error: null,
};

export const initialBranchState = {
  name: null,
  isAvailable: false,
  error: null,
};

export const initialCherryPickState = {
  error: null,
  success: null,
};

export const initialAppState = {
  isAuthenticated: false,
  authData: null,
};

export const initialContextState = {
  app: initialAppState,
  pullRequest: initialPullRequestState,
  branch: initialBranchState,
  cherryPick: initialCherryPickState,
  loading: initialLoadingState,
};

export const updateContextState = (setState, updates) => {
  setState(prev => {
    const next = { ...prev };

    for (const key in updates) {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
        next[key] = { ...prev[key], ...updates[key] };
      } else {
        next[key] = updates[key];
      }
    }

    return next;
  });
};

const MessageProvider = ({ children }) => {
  const [state, setState] = useState(initialContextState);

  useEffect(() => {
    const handleMessage = event => {
      const { type, payload } = event.data;

      if (type === MESSAGE_TYPE.AUTH_SUCCESS) {
        updateContextState(setState, {
          app: { isAuthenticated: true, authData: { ...payload } },
          loading: { github: false, bitbucket: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.AUTH_ERROR) {
        updateContextState(setState, {
          app: { isAuthenticated: false, authData: { ...payload } },
          loading: { github: false, bitbucket: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_COMMITS_SUCCESS) {
        updateContextState(setState, {
          pullRequest: { commits: payload.prCommits, details: payload.prDetails },
          loading: { fetchCommitsCTA: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_COMMITS_ERROR) {
        updateContextState(setState, {
          pullRequest: { commits: [], details: null, error: payload.error },
          loading: { fetchCommitsCTA: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_BRANCH_SUCCESS) {
        updateContextState(setState, {
          branch: { isAvailable: payload.isBranchAvailable, name: payload.branchName },
          loading: { searchBranchCTA: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_BRANCH_ERROR) {
        updateContextState(setState, {
          branch: { isAvailable: false, error: payload.error },
          loading: { searchBranchCTA: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.CHERRY_PICK_SUCCESS) {
        updateContextState(setState, {
          cherryPick: { success: payload.cherryPickSuccess },
          loading: { cherryPickCTA: false },
        });
        return;
      }

      if (type === MESSAGE_TYPE.CHERRY_PICK_ERROR) {
        updateContextState(setState, {
          cherryPick: { error: payload.cherryPickError },
          loading: { cherryPickCTA: false },
        });
        return;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <MessageContext.Provider value={{ state, setState }}>{children}</MessageContext.Provider>;
};
export default MessageProvider;
