import { useState, useRef, useEffect } from 'react';

export function MyDropDown({ options, title, onchange, selectedOptions }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown container

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionChange = (option) => {
    // Create a new array based on whether the option is already selected
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];
    onchange(newSelectedOptions); // Pass the new array to the parent component
  };

  // Effect to handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="float-right justify-center mx-auto my-0 flex relative ">
      <button
        id="dropdown-button"
        type="button"
        onClick={toggleDropdown}
        className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center dark:text-gray-900 text-gray-800 dark:bg-gray-300 bg-gray-100 border dark:border-gray-300 border-gray-600 rounded-lg dark:hover:bg-gray-200 hover:bg-gray-200 focus:outline-none "
      >
        {/* Display selected options dynamically or show the default title */}
        {selectedOptions.length > 0 ? selectedOptions.join(' و ') : title}
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div
          id="dropdown"
          className="z-10 dark:bg-white bg-gray-200 divide-y divide-gray-100 rounded-lg shadow w-44 absolute mt-12"
        >
          <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdown-button">
            {options.map((option, index) => (
              <li key={index}>
                <div className="flex items-center p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-100">
                  <input
                    id={`checkbox-item-${index}`}
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    className="border-LightGreen border-2 rounded-md m-auto w-5 h-5 bg-transparent mr-auto checked:!bg-LightGreen"
                  />
                  <label htmlFor={`checkbox-item-${index}`} className="w-full ms-2 text-sm font-medium text-black">
                    {option}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}