import { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaChevronDown,
} from "react-icons/fa";

type DefaultInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  helperLink?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email";
  leftContent?: React.ReactNode | string;
  rightContent?: React.ReactNode | string;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  required?: boolean;
  minLength?: number;
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
}: DefaultInputProps) => {
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;
  const isFilled = value.trim().length > 0;
  const hasError = !!error;

  const validate = () => {
    if (disabled) return null;
    if (required && value.trim() === "") return "This field is required.";
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email.";
    if (type === "password" && value.length < minLength)
      return `Password must be at least ${minLength} characters.`;
    return null;
  };

  useEffect(() => {
    if (touched) {
      setError(validate());
    }
  }, [value]);

  const handleBlur = () => {
    setTouched(true);
    setError(validate());
  };

  const baseStyle = `text-[16px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[16px] rounded-[4px] py-[12px] px-[16px] md:w-[365px] flex items-center 
    hover:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] focus:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] 
    ${hasError ? "border-red" : isFilled ? "border-purple" : "border-neutral"} 
    hover:border-lightPurple focus:border-lightPurple 
    disabled:bg-darkGrey disabled:cursor-not-allowed`;

  const paddingLeft = leftContent ? "pl-[40px]" : "";
  const paddingRight =
    type === "password" || rightContent || showDropdown || hasError
      ? "pr-[70px]" // leave room for both error and right content
      : "";

  return (
    <div className="grid gap-2 w-fit relative">
      <label htmlFor={id} className="text-black font-bold text-[16px]">
        {label}
      </label>

      <div className="relative">
        {leftContent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralDark text-[14px]">
            {leftContent}
          </div>
        )}

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
          className={`${baseStyle} ${paddingLeft} ${paddingRight}`}
        />

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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}

          {rightContent && type !== "password" && !showDropdown && (
            <span className="text-neutralDark text-[14px]">{rightContent}</span>
          )}
          {showDropdown && (
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
          )}
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
