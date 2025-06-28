import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';

const CherryPick = () => {
  const { state, setState } = useMessage();
  const { selectedCommits, branchName, cherryPickError, cherryPickSuccess, loading } = state;
  const isVisible = branchName && selectedCommits.length;
  const isLoading = loading.cherryPickCTA || false;

  console.warn(state);
  const handleOnClick = () => {
    console.warn({ selectedCommits, branchName });
    setState(prev => ({ ...prev, loading: { ...prev.loading, cherryPickCTA: true } }));
    postToExtension({
      type: MESSAGE_TYPE.CHERRY_PICK_REQUEST,
      payload: { targetBranch: branchName, commits: selectedCommits, provider: 'bitbucket' },
    });
  };

  if (!isVisible) return;

  if (cherryPickError) {
    const { message } = cherryPickError;

    return (
      <Section className="cherryPickError">
        <div>{message}</div>;
      </Section>
    );
  }

  if (cherryPickSuccess) {
    const { branchUrl, message, branch } = cherryPickSuccess;
    return (
      <Section className="cherryPickSuccess">
        <div>{message}</div>
        <a href={branchUrl}>{branch}</a>
      </Section>
    );
  }

  return (
    <Section>
      <Button isLoading={isLoading} label="Let's Cherry Pick" handleOnClick={handleOnClick} />
    </Section>
  );
};
export default CherryPick;
