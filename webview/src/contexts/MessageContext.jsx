import { MESSAGE_TYPE } from '../../../shared/constants';
import { useEffect, useState, createContext } from 'react';

export const MessageContext = createContext();

export const initialLoadingState = {
  github: false,
  bitbucket: false,
  fetchCommitsCTA: false,
  searchBranchCTA: false,
};

export const initialContextState = {
  isAuthenticated: false,
  authData: null,
  prDetails: null,
  prCommits: [],
  selectedCommits: [],
  isBranchAvailable: false,
  branchError: null,
  cherryPickError: null,
  cherryPickSuccess: null,
  branchName: null,
  loading: initialLoadingState,
};

const MessageProvider = ({ children }) => {
  const [state, setState] = useState(initialContextState);

  useEffect(() => {
    const handleMessage = event => {
      const { type, payload } = event.data;

      if (type === MESSAGE_TYPE.AUTH_SUCCESS) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          authData: { ...payload },
          loading: { ...prev.loading, github: false, bitbucket: false },
        }));
        return;
      }

      if (type === MESSAGE_TYPE.AUTH_ERROR) {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          authData: { ...payload },
          loading: { ...prev.loading, github: false, bitbucket: false },
        }));
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_COMMITS_SUCCESS) {
        console.warn({ payload });
        setState(prev => ({
          ...prev,
          prCommits: payload.prCommits,
          prDetails: payload.prDetails,
          loading: { ...prev.loading, fetchCommitsCTA: false },
        }));
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_BRANCH_SUCCESS) {
        console.warn({ payload });
        setState(prev => ({
          ...prev,
          isBranchAvailable: payload.isBranchAvailable,
          branchName: payload.branchName,
          loading: { ...prev.loading, searchBranchCTA: false },
        }));
        return;
      }

      if (type === MESSAGE_TYPE.FETCH_BRANCH_ERROR) {
        console.warn({ payload });
        setState(prev => ({
          ...prev,
          isBranchAvailable: payload.isBranchAvailable,
          branchError: payload.branchError,
          loading: { ...prev.loading, searchBranchCTA: false },
        }));
        return;
      }

      if (type === MESSAGE_TYPE.CHERRY_PICK_SUCCESS) {
        console.warn({ payload });
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, cherryPickCTA: false },
          cherryPickSuccess: payload.cherryPickSuccess,
        }));
        return;
      }

      if (type === MESSAGE_TYPE.CHERRY_PICK_ERROR) {
        console.warn({ payload });
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, cherryPickCTA: false },
          cherryPickError: payload.cherryPickError,
        }));
        return;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <MessageContext.Provider value={{ state, setState }}>{children}</MessageContext.Provider>;
};
export default MessageProvider;
