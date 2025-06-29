const Commit = ({ commit, handleCheckboxChange, isInputRequired = false, selectedCommits = [] }) => {
  return (
    <div className="commitItem" key={commit.sha}>
      <div className="commitInfo">
        <div>
          <strong>Message: </strong> <span>{commit.message}</span>
        </div>
        <div>
          <strong>Commit: </strong> <code>{String(commit.sha).slice(0, 7)}</code>
        </div>
        <div>
          <strong>Time: </strong>
          <span>
            {new Date(commit.date).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      {isInputRequired && <input type="checkbox" checked={selectedCommits.includes(commit.sha)} onChange={() => handleCheckboxChange(commit.sha)} />}
    </div>
  );
};
export default Commit;
