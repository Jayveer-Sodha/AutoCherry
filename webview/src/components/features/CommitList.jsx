import Commit from '../common/Commit';
import Button from '../common/Button';
import Section from '../common/Section';
import { useEffect, useState } from 'react';
import { useMessage } from '../../hooks/useMessage';
import { updateContextState } from '../../contexts/MessageContext';

const CommitsList = () => {
  const { state, setState } = useMessage();
  const { app: { isAuthenticated = false } = {}, pullRequest: { commits = [] } = {} } = state;
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [finalCommits, setFinalCommits] = useState([]);

  const handleCheckboxChange = sha => {
    setSelectedCommits(prev => (prev.includes(sha) ? prev.filter(item => item !== sha) : [...prev, sha]));
  };

  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        setFinalCommits([]);
        setSelectedCommits([]);
      }
    };
  }, [isAuthenticated]);

  const handleCherryPick = () => {
    const selected = commits.filter(commit => selectedCommits.includes(commit.sha));
    updateContextState(setState, {
      pullRequest: { selectedCommits: selected },
    });
    setFinalCommits(selected);
  };

  if (commits.length === 0) return null;

  if (finalCommits.length) {
    return (
      <Section>
        <div className="commitList">
          <label className="commitLabel">Selected Commits</label>
          {finalCommits.map(commit => (
            <Commit commit={commit} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="commitList">
        <label className="commitLabel">Please Select Commits</label>
        {commits.map(commit => (
          <Commit commit={commit} handleCheckboxChange={handleCheckboxChange} isInputRequired selectedCommits={selectedCommits} />
        ))}
        <Button disabled={!selectedCommits.length} label="Confirm Commits" handleOnClick={handleCherryPick} />
      </div>
    </Section>
  );
};

export default CommitsList;
