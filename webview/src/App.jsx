import CherryPick from './components/features/CherryPick';
import CommitList from './components/features/CommitList';
import AuthButtons from './components/features/AuthButtons';
import ResetButton from './components/features/ResetButton';
import SearchBranch from './components/features/SearchBranch';
import CommitsSearchByPR from './components/features/CommitsSearchByPR';

const App = () => {
  return (
    <div>
      <AuthButtons />
      <CommitsSearchByPR />
      <CommitList />
      <SearchBranch />
      <CherryPick />
      <ResetButton />
    </div>
  );
};

export default App;
