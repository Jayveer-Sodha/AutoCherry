import Section from '../common/Section';
import SearchInput from '../common/SearchInput';
import { useMessage } from '../../hooks/useMessage';
import { MESSAGE_TYPE } from '../../../../shared/constants';
import { postToExtension } from '../../handlers/MessageHandlers';
import { updateContextState } from '../../contexts/MessageContext';

const SearchBranch = () => {
  const { state, setState } = useMessage();
  const {
    branch: { isAvailable = false, name = '', error = null } = {},
    loading: { searchBranchCTA = false } = {},
    pullRequest: { selectedCommits = [] } = {},
  } = state;

  const handleSearch = query => {
    updateContextState(setState, { loading: { searchBranchCTA: true } });
    postToExtension({
      type: MESSAGE_TYPE.FETCH_BRANCH_REQUEST,
      payload: { branchName: query },
    });
  };
  if (!selectedCommits.length) return;

  if (isAvailable) {
    return (
      <Section>
        <div className="branchInfo">
          <strong>Target Branch : </strong> <span>{name}</span>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SearchInput error={error} isLoading={searchBranchCTA} inputLabel="Enter branch name..." onSearch={handleSearch} buttonLabel="Search" />
    </Section>
  );
};
export default SearchBranch;
