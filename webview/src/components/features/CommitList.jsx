import Button from '../common/Button';
import Section from '../common/Section';
import { useEffect, useState } from 'react';
import { useMessage } from '../../hooks/useMessage';

const CommitsList = () => {
  const { state, setState } = useMessage();
  const { prCommits, isAuthenticated } = state;
  const commits = prCommits || [];
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
    setState(prev => ({
      ...prev,
      selectedCommits: selected,
    }));
    console.log('✅ Selected commits for cherry-pick:', selected);
    setFinalCommits(selected);
  };

  if (commits.length === 0) return null;

  if (finalCommits.length) {
    return (
      <Section>
        <div className="finalCommitsDiv">
          <label>Selected Commits</label>
          {finalCommits.map(commit => {
            return <span>{commit.message}</span>;
          })}
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="commits-container">
        {commits.map(commit => (
          <div className="commit-item" key={commit.sha}>
            <label className="commit-label">{commit.message}</label>
            <div className="commit-info">
              <input type="checkbox" checked={selectedCommits.includes(commit.sha)} onChange={() => handleCheckboxChange(commit.sha)} />
              <div className="commit-sha">{String(commit.sha).slice(0, 8)}</div>
              <span className="commit-date">
                {new Date(commit.date).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        <Button label="Confirm Commits" handleOnClick={handleCherryPick} />
      </div>
    </Section>
  );
};

export default CommitsList;
