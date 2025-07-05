import Button from './Button';
import { useEffect, useState } from 'react';

const SearchInput = ({
  inputPlaceholder = 'Type...',
  onSearch,
  buttonLabel = 'Search',
  inputLabel = 'Enter pull request number...',
  isLoading,
  error = null,
  type = undefined,
}) => {
  const [value, setValue] = useState('');
  const [searchError, setSearchError] = useState(null);
  let isDisable = !value;
  console.warn({ error });
  useEffect(() => {
    setSearchError(error);
    if (error === null) {
      setValue('');
      isDisable = false;
    }
  }, [error]);

  const handleChange = e => {
    const input = e.target.value;
    setValue(input);
    setSearchError(null);
  };

  const handleOnClick = e => {
    e.preventDefault();
    if (value.trim() && onSearch) {
      onSearch(value.trim());
    }
  };

  const handleOnKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOnClick(e);
    }
  };

  return (
    <form className="searchInputContainer" onSubmit={handleOnClick} onKeyDown={handleOnKeyDown}>
      <label>{inputLabel}</label>
      <input type={type} value={value} onChange={handleChange} placeholder={inputPlaceholder} className="searchInput" />
      <Button buttonType="submit" isLoading={isLoading} disabled={isDisable} label={buttonLabel} />
      {searchError?.key && value && !isLoading && (
        <div className="errorlable">
          <strong>{searchError?.key}</strong>
          <span>{searchError?.value}</span>
        </div>
      )}
    </form>
  );
};

export default SearchInput;
