import { useState, useEffect, useRef } from "react";
import {
  FaExclamationTriangle,
  FaChevronDown,
} from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";


type DefaultInputProps = {
  id: string;
  label: string;
  value: any;
  setValue: any;
  placeholder?: string;
  helperText?: string;
  helperLink?: string;
  disabled?: boolean;
type?: "text" | "password" | "email"|"tel"|"date"|"time";
  leftContent?: React.ReactNode | string;
  rightContent?: React.ReactNode | string;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  required?: boolean;
  minLength?: number;
  style?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  setExternalError?: (hasError: boolean) => void;
  classname?: string;
};

const DefaultInput = ({
  id = "input-id",
  label = "Label",
  placeholder = "Enter value",
  helperText = "",
  helperLink = "",
  disabled = false,
  type = "text",
  leftContent,
  rightContent,
  showDropdown = false,
  dropdownOptions = [],
  required = false,
  minLength = 6,
  style = "",
  value,
  setValue,
  inputRef,
  setExternalError,
  classname=''
}: DefaultInputProps) => {
  // const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const inputType = type === "password" && showPassword ? "text" : type;
  const isFilled = value.trim().length > 0;
  const hasError = !!error;

  const validate = () => {
    if (disabled) return null;
    if (required && value.trim() === "") return "This field is required.";
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email.";
    if (type === "password") {
      if (value.length < 8) {
        return "Password must be at least 8 characters.";
      }

      // Check for a mix of letters (both uppercase and lowercase)
      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
        return "Password must contain a mix of uppercase and lowercase letters.";
      }

      // Check for numbers
      if (!/\d/.test(value)) {
        return "Password must contain at least one number.";
      }

      // Check for symbols
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return "Password must contain at least one special character.";
      }
    }
    return null;
  };

  useEffect(() => {
    if (touched) {
      setError(validate());
    }
    const validationError = validate();
    if (setExternalError) {
      if (setExternalError) {
        setExternalError(!!validationError); // True if there's an error, false otherwise
      }
    }
  }, [value]);

  const handleBlur = () => {
    setTouched(true);
    setError(validate());
  };

  const baseStyle = `text-[14px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[14px] font-[RedHat] rounded-[4px] py-[10px] px-[16px] md:w-[20rem] flex items-center ${classname}
    hover:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] focus:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] 
    ${hasError ? "border-red" : isFilled ? "border-purple" : "border-neutral"} 
    hover:border-lightPurple focus:border-lightPurple 
    disabled:bg-darkGrey disabled:cursor-not-allowed bg-white`;

  const paddingLeft = leftContent ? "pl-[40px]" : "";
  const paddingRight =
    type === "password" || rightContent || showDropdown || hasError
      ? "pr-[70px]" // leave room for both error and right content
      : "";

  return (
    <div className="grid gap-1  w-full relative">
      <label
        htmlFor={id}
        className="text-[#231F20] text-[16px] font-semibold font-[RedHat]"
      >
        {label}
      </label>

      <div className="relative">
        {leftContent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralDark text-[14px]">
            {leftContent}
          </div>
        )}

        {/* <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          aria-describedby={`${id}-helper`}
          aria-invalid={hasError}
          className={`${baseStyle} ${paddingLeft} ${paddingRight} ${style}`}
        /> */}
{showDropdown ? (
  <div className="relative w-full">
  <select
    id={id}
    disabled={disabled}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={handleBlur}
    aria-describedby={`${id}-helper`}
    aria-invalid={hasError}
    className={`${baseStyle} ${paddingLeft} pr-[40px] ${style} appearance-none cursor-pointer`}
  >
    <option value="" disabled hidden>
      {placeholder}
    </option>
    {dropdownOptions.map((opt, idx) => (
      <option key={idx} value={opt}>
        {opt}
      </option>
    ))}
  </select>

  {/* Chevron icon positioned absolutely */}
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutralDark text-sm">
    <FaChevronDown />
  </div>
</div>
) : (
  <input
    id={id}
    type={inputType}
    placeholder={placeholder}
    disabled={disabled}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={handleBlur}
    aria-describedby={`${id}-helper`}
    aria-invalid={hasError}
    className={`${baseStyle} ${paddingLeft} ${paddingRight} ${style}`}
  />
)}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {hasError && (
            <span className="text-red">
              <FaExclamationTriangle />
            </span>
          )}

          {type === "password" && (
            <span
              className="text-neutralDark cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff className="text-lg"/> : <FiEye className="text-lg"/>}
            </span>
          )}

          {rightContent && type !== "password" && !showDropdown && (
            <span className="text-neutralDark text-[14px]">{rightContent}</span>
          )}
          {/* {showDropdown && (
            <div className="flex items-center cursor-pointer">
              <select className="bg-white text-neutralDark text-[14px] pr-6 pl-2 py-1 rounded appearance-none outline-none border-none cursor-pointer">
                {dropdownOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-neutralDark text-sm">
                <FaChevronDown />
              </div>
            </div>
          )} */}
        </div>
      </div>

      {hasError ? (
        <p id={`${id}-helper`} className="text-[13px] text-red">
          {error}
        </p>
      ) : (
        <p id={`${id}-helper`} className="text-[13px] text-[#665B6D]">
          {helperText}{" "}
          <span className="text-purple underline cursor-pointer">
            {helperLink}
          </span>
        </p>
      )}
    </div>
  );
};

export default DefaultInput;

// sample use of the default input
// import DefaultInput from "./DefaultInput";
// import { FaUser } from "react-icons/fa";

// const SampleForm = () => {
//   return (
//     <div className="space-y-6 p-6">
//       {/* Basic Text Input with Left and Right Content */}
//       <DefaultInput
//         id="username"
//         label="Username"
//         placeholder="Enter your username"
//         helperText="Your unique ID"
//         helperLink="Learn more"
//         leftContent={<FaUser />}
//         rightContent="@example.com"
//         required
//       />

//       {/* Email Input with Validation */}
//       <DefaultInput
//         id="email"
//         type="email"
//         label="Email Address"
//         placeholder="user@example.com"
//         helperText="We'll never share your email"
//         helperLink="Privacy policy"
//         required
//       />

//       {/* Password Input with Visibility Toggle */}
//       <DefaultInput
//         id="password"
//         type="password"
//         label="Password"
//         placeholder="••••••••"
//         helperText="Use 6+ characters"
//         helperLink="Forgot password?"
//         required
//         minLength={6}
//       />

//       {/* Disabled Input */}
//       <DefaultInput
//         id="disabled"
//         label="Disabled Input"
//         placeholder="Can't type here"
//         helperText="This field is disabled"
//         helperLink="Why?"
//         disabled
//       />

//       {/* Dropdown Input */}
//       <DefaultInput
//         id="country"
//         label="Country"
//         placeholder="Select your country"
//         helperText="Choose your home country"
//         helperLink="Help"
//         showDropdown
//         dropdownOptions={["Canada", "USA", "UK"]}
//         rightContent="🌐"
//         required
//       />
//     </div>
//   );
// };

// export default SampleForm;
