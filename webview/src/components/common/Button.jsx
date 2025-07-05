const Button = ({ buttonType, label, disabled, handleOnClick, isLoading }) => {
  return (
    <div className={`buttonContainer ${disabled && 'disabled'}`}>
      <button type={buttonType} disabled={disabled} onClick={handleOnClick}>
        {!isLoading ? label : 'Loading...'}
      </button>
    </div>
  );
};

export default Button;
