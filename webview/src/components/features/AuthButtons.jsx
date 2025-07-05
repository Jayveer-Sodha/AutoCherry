import { useCallback, useEffect, useState } from 'react';
import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { postToExtension } from '../../handlers/MessageHandlers';
import { initialAppState, updateContextState } from '../../contexts/MessageContext';
import { AUTH_TYPE, GIT_LABEL, MESSAGE_TYPE } from '../../../../shared/constants';

const AuthButtons = () => {
  const { state, setState } = useMessage();
  const {
    app: { isAuthenticated, authData: { provider = null, error = null } } = {},
    loading: { bitbucket: isBitbucketLoading = false, github: isGithubLoading = false, isfetchingProvider = false } = {},
  } = state;

  const [currentProvider, setCurrentProvider] = useState(null);

  useEffect(() => {
    if (!provider) {
      updateContextState(setState, { loading: { isfetchingProvider: true } });
      postToExtension({ type: MESSAGE_TYPE.PROVIDER_REQUEST });
    }
  }, []);

  useEffect(() => {
    if (provider) {
      setCurrentProvider(provider);
    }
  }, [provider]);

  const requestAuth = useCallback(
    provider => {
      updateContextState(setState, { app: { authData: { ...initialAppState.authData, provider } }, loading: { [provider]: true } });
      postToExtension({
        type: MESSAGE_TYPE.AUTH_REQUEST,
        payload: { provider },
      });
    },
    [setState],
  );

  const handleReload = () => {
    postToExtension({ type: MESSAGE_TYPE.RELOAD_APP });
  };

  const AuthProvider = {
    [AUTH_TYPE.BITBUCKET]: (
      <Button
        disabled={isGithubLoading}
        isLoading={isBitbucketLoading}
        label={GIT_LABEL.BITBUCKET}
        handleOnClick={() => requestAuth(AUTH_TYPE.BITBUCKET)}
      />
    ),
    [AUTH_TYPE.GITHUB]: (
      <Button
        disabled={isBitbucketLoading}
        isLoading={isGithubLoading}
        label={GIT_LABEL.GITHUB}
        handleOnClick={() => requestAuth(AUTH_TYPE.GITHUB)}
      />
    ),
  };

  if (isfetchingProvider)
    return (
      <Section>
        <div className="fetchingProviderDiv">Fetching Provider...</div>
      </Section>
    );

  if (isAuthenticated)
    return (
      <Section>
        <div className="authSuccessDiv">Connected to {currentProvider}</div>
      </Section>
    );

  return (
    <Section>
      <div className="authButtonsSection">{AuthProvider[currentProvider]}</div>
      {error?.message && <div className="authErrorDiv">{error.message}</div>}
      {error?.message && !provider && <Button label="Reload" handleOnClick={handleReload} />}
    </Section>
  );
};
export default AuthButtons;
