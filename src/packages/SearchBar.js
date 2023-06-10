import React from 'react';
import { Link } from 'react-router-dom';

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
      <form>
        <div className="form-row mb-5">
          <div className="col-12">
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="form-control" 
              placeholder={'Ara...'}
            />
          </div>
        </div>  
      </form>  
    );
  };

export default SearchBar;