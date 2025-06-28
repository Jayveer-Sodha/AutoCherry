const Button = ({ label, disabled, handleOnClick, isLoading }) => {
  return (
    <div className={`buttonContainer ${disabled && 'disabled'}`}>
      <button disabled={disabled} onClick={handleOnClick}>
        {!isLoading ? label : 'Loading...'}
      </button>
    </div>
  );
};

export default Button;
