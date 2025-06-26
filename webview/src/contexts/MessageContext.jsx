import { MESSAGE_TYPE } from '../../../shared/constants';
import { useEffect, useState, createContext } from 'react';

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    authData: null,
    loading: {
      github: false,
      bitbucket: false,
    },
  });

  useEffect(() => {
    const handleMessage = event => {
      const { type, payload } = event.data;
      switch (type) {
        case MESSAGE_TYPE.AUTH_SUCCESS:
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            authData: { ...payload },
            loading: { ...prev.loading, github: false, bitbucket: false },
          }));
          break;
        case MESSAGE_TYPE.AUTH_ERROR:
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            authData: { ...payload },
            loading: { ...prev.loading, github: false, bitbucket: false },
          }));
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <MessageContext.Provider value={{ state, setState }}>{children}</MessageContext.Provider>;
};
export default MessageProvider;
