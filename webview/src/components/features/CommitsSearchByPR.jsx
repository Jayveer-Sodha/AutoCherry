import { useCallback } from 'react';
import Section from '../common/Section';
import SearchInput from '../common/SearchInput';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';

const CommitsSearchByPR = () => {
  const { state, setState } = useMessage();
  const { isAuthenticated, prDetails, loading } = state;
  const isLoading = loading?.fetchCommitsCTA || false;
  console.warn({ prDetails });

  const handleSearch = useCallback(query => {
    console.log('Searching for:', query);
    setState(prev => ({ ...prev, loading: { ...prev.loading, fetchCommitsCTA: true } }));
    postToExtension({
      type: MESSAGE_TYPE.FETCH_COMMITS_REQUEST,
      payload: { prId: query },
    });
  }, []);

  if (!isAuthenticated) return;
  return (
    <Section style={{ padding: '20px' }}>
      {prDetails ? (
        <div className="pullrequestInfo">
          <h3 className="header">Pull Request Info</h3>

          <div className="title">
            <strong>Title: </strong>
            <span>{prDetails.title}</span>
          </div>

          <div className="number">
            <strong>PR Number: </strong>
            <span>{prDetails.id}</span>
          </div>
        </div>
      ) : (
        <SearchInput onSearch={handleSearch} buttonLabel="Fetch Commits" isLoading={isLoading} />
      )}
    </Section>
  );
};

export default CommitsSearchByPR;
