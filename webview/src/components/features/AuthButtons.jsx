import { useCallback } from 'react';
import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { postToExtension } from '../../handlers/MessageHandlers';
import { updateContextState } from '../../contexts/MessageContext';
import { AUTH_TYPE, GIT_LABEL, MESSAGE_TYPE } from '../../../../shared/constants';

const AuthButtons = () => {
  const { state, setState } = useMessage();
  const { app, loading } = state;
  const { isAuthenticated, authData } = app;
  const isBitbucketLoading = loading?.bitbucket || false;
  const isGithubLoading = loading?.github || false;

  const requestAuth = useCallback(
    provider => {
      updateContextState(setState, { app: { authData: null, loading: { [provider]: true } } });
      postToExtension({
        type: MESSAGE_TYPE.AUTH_REQUEST,
        payload: { provider },
      });
    },
    [setState],
  );

  if (isAuthenticated)
    return (
      <Section>
        <div className="authSuccessDiv">Connected to {authData.provider}</div>
      </Section>
    );

  return (
    <Section>
      <div className="authButtonsSection">
        <Button
          disabled={isBitbucketLoading}
          isLoading={isGithubLoading}
          label={GIT_LABEL.GITHUB}
          handleOnClick={() => requestAuth(AUTH_TYPE.GITHUB)}
        />
        <Button
          disabled={isGithubLoading}
          isLoading={isBitbucketLoading}
          label={GIT_LABEL.BITBUCKET}
          handleOnClick={() => requestAuth(AUTH_TYPE.BITBUCKET)}
        />
      </div>
      {authData?.error?.message && <div className="authErrorDiv">{authData.error.message}</div>}
    </Section>
  );
};
export default AuthButtons;
