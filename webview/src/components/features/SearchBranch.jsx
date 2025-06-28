import Section from '../common/Section';
import SearchInput from '../common/SearchInput';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';

const SearchBranch = () => {
  const { state, setState } = useMessage();
  const { selectedCommits = [], loading, isBranchAvailable, branchName, branchError } = state;
  console.warn({ loading, state, branchError });
  const isLoading = loading.searchBranchCTA || false;

  const handleSearch = query => {
    console.log('Searching for:', query);
    setState(prev => ({ ...prev, loading: { ...prev.loading, searchBranchCTA: true } }));
    postToExtension({
      type: MESSAGE_TYPE.FETCH_BRANCH_REQUEST,
      payload: { branchName: query },
    });
  };
  if (!selectedCommits.length) return;

  if (isBranchAvailable) {
    return (
      <Section>
        <div className="branchInfo">
          <strong>Target Branch : </strong> <span>{branchName}</span>
        </div>
      </Section>
    );
  }
  let error = null;
  if (branchError?.message) {
    error = {
      key: 'Message : ',
      value: branchError?.message,
    };
  }
  return (
    <Section>
      <SearchInput error={error} isLoading={isLoading} inputLabel="Enter branch name..." onSearch={handleSearch} buttonLabel="Search" />
    </Section>
  );
};
export default SearchBranch;
