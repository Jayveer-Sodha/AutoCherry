import { useCallback } from 'react';
import Button from '../common/Button';
import { useMessage } from '../../hooks/useMessage';
import { postToExtension } from '../../handlers/MessageHandlers';
import { AUTH_TYPE, GIT_LABEL, MESSAGE_TYPE } from '../../../../shared/constants';

const AuthButtons = () => {
  const { state, setState } = useMessage();
  const { isAuthenticated, authData, loading } = state;
  const isBitbucketLoading = loading?.bitbucket || false;
  const isGithubLoading = loading?.github || false;

  const requestAuth = useCallback(
    provider => {
      setState(prev => ({ ...prev, authData: null, loading: { ...prev.loading, [provider]: true } }));

      postToExtension({
        type: MESSAGE_TYPE.AUTH_REQUEST,
        payload: { provider },
      });
    },
    [setState],
  );

  if (isAuthenticated) return <div className="authSuccessDiv">Connected to {authData.provider}</div>;
  return (
    <>
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
    </>
  );
};
export default AuthButtons;
