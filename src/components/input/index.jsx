import React from "react";

const index = ({
  label = "",
  name = "",
  type = "text",
  className = "",
  inputClassName = '',
  isRequired = false,
  placeholder = "",
  value = "",
  onChange = () => {}
}) => {
  return (
    <div className={`${className}`}>
        <label htmlFor={label} className="block text-sm font-meduim text-gray-800">{label}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
        className={` border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
        
        ${inputClassName}`}
      />
    </div>
  );
};

export default index;
