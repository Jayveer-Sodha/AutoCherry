import Button from './Button';
import { useEffect, useState } from 'react';

const SearchInput = ({
  error = null,
  inputPlaceholder = 'Type...',
  onSearch,
  buttonLabel = 'Search',
  inputLabel = 'Enter pull request number...',
  isLoading,
}) => {
  const [value, setValue] = useState('');
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (error) {
      setSearchError(error);
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

  const isDisable = !value;
  return (
    <div className="searchInputContainer">
      <label>{inputLabel}</label>
      <input type="text" value={value} onChange={handleChange} placeholder={inputPlaceholder} className="searchInput" />
      <Button isLoading={isLoading} disabled={isDisable} label={buttonLabel} handleOnClick={handleOnClick} />
      {searchError?.key && value && !isLoading && (
        <div className="errorlable">
          <strong>{searchError?.key}</strong>
          <span>{searchError?.value}</span>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
