import { useCallback } from 'react';
import Section from '../common/Section';
import SearchInput from '../common/SearchInput';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';
import { updateContextState } from '../../contexts/MessageContext';

const CommitsSearchByPR = () => {
  const { state, setState } = useMessage();
  const {
    app: { isAuthenticated = false, authData: { provider = null } = {} } = {},
    pullRequest: { details = null, error = null } = {},
    loading: { fetchCommitsCTA = false } = {},
  } = state;

  const handleSearch = useCallback(
    query => {
      updateContextState(setState, { loading: { fetchCommitsCTA: true } });
      postToExtension({
        type: MESSAGE_TYPE.FETCH_COMMITS_REQUEST,
        payload: { prId: query, provider },
      });
    },
    [provider],
  );

  if (!isAuthenticated) return;
  return (
    <Section style={{ padding: '20px' }}>
      {details ? (
        <div className="pullrequestInfo">
          <h3 className="header">Pull Request Info</h3>

          <div className="title">
            <strong>Title: </strong>
            <span>{details.title}</span>
          </div>

          <div className="number">
            <strong>PR Number: </strong>
            <span>{details.id}</span>
          </div>
        </div>
      ) : (
        <SearchInput type="number" error={error} onSearch={handleSearch} buttonLabel="Fetch Commits" isLoading={fetchCommitsCTA} />
      )}
    </Section>
  );
};

export default CommitsSearchByPR;
