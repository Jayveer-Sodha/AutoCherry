import Button from '../common/Button';
import Section from '../common/Section';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';
import { updateContextState } from '../../contexts/MessageContext';

const CherryPick = () => {
  const { state, setState } = useMessage();
  const {
    branch: { name = '' } = {},
    loading: { cherryPickCTA = false } = {},
    pullRequest: { selectedCommits = [] } = {},
    app: { authData: { provider = null } } = {},
    cherryPick: { error = null, success = null } = {},
  } = state;

  const isVisible = name && selectedCommits.length;

  const handleOnClick = () => {
    updateContextState(setState, { loading: { cherryPickCTA: true } });
    postToExtension({
      type: MESSAGE_TYPE.CHERRY_PICK_REQUEST,
      payload: { targetBranch: name, commits: selectedCommits, provider },
    });
  };

  if (!isVisible) return;

  if (error) {
    const { message } = error;

    return (
      <Section className="cherryPickError">
        <div>{message}</div>;
      </Section>
    );
  }

  if (success) {
    const { branchUrl, message, branch } = success;
    return (
      <Section className="cherryPickSuccess">
        <div>
          <strong>Message: </strong> <span>{message}</span>
        </div>
        <div>
          <strong>Link: </strong> <a href={branchUrl}>{branch}</a>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <Button isLoading={cherryPickCTA} label="Let's Cherry Pick" handleOnClick={handleOnClick} />
    </Section>
  );
};
export default CherryPick;
