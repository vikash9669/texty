import React from "react";

const Button = ({
  label = "Button",
  type = "button",
  className = "",
  disabled = false,
  // onClick =()=>{}
}) => {
  return (

      <button
        type={type}
        className={`text-white bg-blue-700 hover:bg-lightblue-800 focus:ring-4 
      focus:outline-none focus:ring-blue-300 font-medium rounded-lg mt-14px
       px-5 py-2.5 block w-full text center ${className}`}
       disabled={disabled}
      
      >
        {label}
      </button>

  );
};

export default Button;
