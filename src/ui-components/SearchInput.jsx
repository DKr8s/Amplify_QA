import React from 'react';

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full md:w-1/2">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border rounded shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
