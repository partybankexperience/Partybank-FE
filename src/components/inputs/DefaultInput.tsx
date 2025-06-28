import { useState, useEffect, forwardRef } from 'react';
import { FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type DefaultInputProps = {
  id: string;
  label: string;
  value: any;
  setValue: any;
  placeholder?: string;
  helperText?: string;
  helperLink?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'email' | 'tel' | 'date' | 'time' | 'number';
  leftContent?: React.ReactNode | string;
  rightContent?: React.ReactNode | string;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  required?: boolean;
  minLength?: number;
  style?: string;
  setExternalError?: (error: boolean) => void;
  classname?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  min?: string;
  externalErrorMessage?: string | null;
};

// ✅ forwardRef for external access to DOM element
const DefaultInput = forwardRef<HTMLInputElement, DefaultInputProps>(
  (
    {
      id = 'input-id',
      label = 'Label',
      placeholder = 'Enter value',
      helperText = '',
      helperLink = '',
      disabled = false,
      type = 'text',
      leftContent,
      rightContent,
      showDropdown = false,
      dropdownOptions = [],
      required = false,
      style = '',
      value,
      setValue,
      setExternalError,
      classname = '',
      onKeyDown,
      onBlur,
      min = '',
      externalErrorMessage = null,
    },
    ref,
  ) => {
    // const [value, setValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    // const internalRef = useRef<HTMLInputElement>(null);
    const inputType =
      type === 'password' && showPassword ? 'text' : type === 'number' ? 'tel' : type;
    const stringValue = String(value || '');
    const isFilled = stringValue.trim().length > 0;
    const hasError = !!error;

    const validate = () => {
      if (disabled) return null;
      if (required && stringValue.trim() === '') return 'This field is required.';
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue))
        return 'Please enter a valid email.';
      if (type === 'password') {
        if (stringValue.length < 8) {
          return 'Password must be at least 8 characters.';
        }

        // Check for a mix of letters (both uppercase and lowercase)
        if (!/[a-z]/.test(stringValue) || !/[A-Z]/.test(stringValue)) {
          return 'Password must contain a mix of uppercase and lowercase letters.';
        }

        // Check for numbers
        if (!/\d/.test(stringValue)) {
          return 'Password must contain at least one number.';
        }

        // Check for symbols
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(stringValue)) {
          return 'Password must contain at least one special character.';
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
        setExternalError(!!validationError); // True if there's an error, false otherwise
      }
    }, [value]);

    const handleBlur = (e: any) => {
      setTouched(true);
      setError(validate());
      if (onBlur) {
        onBlur(e);
      }
    };

    const baseStyle = `text-[14px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[14px] font-[RedHat] rounded-[4px] py-[10px] px-[16px] w-full md:w-[20rem] flex items-center ${classname}
    hover:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] focus:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] 
    ${hasError ? 'border-red' : isFilled ? 'border-purple' : 'border-neutral'} 
    hover:border-lightPurple focus:border-lightPurple 
    disabled:bg-darkGrey disabled:cursor-not-allowed bg-white`;

    const paddingLeft = leftContent ? 'pl-[40px]' : '';
    const needsRightPadding =
      type === 'password' ||
      (rightContent && type !== 'date' && type !== 'time') ||
      showDropdown ||
      hasError;

    const paddingRight = needsRightPadding ? 'pr-[70px]' : '';

    return (
      <div className="grid gap-1  w-full relative">
        <label htmlFor={id} className="text-[#231F20] text-[16px] font-semibold font-[RedHat]">
          {label}
        </label>

        <div className="relative">
          {leftContent && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralDark text-[14px]">
              {leftContent}
            </div>
          )}
          {showDropdown ? (
            <div className="relative w-full">
              <select
                id={id}
                disabled={disabled}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => handleBlur(e as any)}
                aria-describedby={`${id}-helper`}
                aria-invalid={hasError}
                // ref={ref}
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
              <div
                className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutralDark text-sm`}
              >
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
              onChange={(e) => {
                if (type === 'number') {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  const numericValue = cleaned === '' ? '' : Number(cleaned);
                  setValue(numericValue);
                } else {
                  setValue(e.target.value);
                }
              }}
              onBlur={(e) => handleBlur(e as any)}
              aria-describedby={`${id}-helper`}
              aria-invalid={hasError}
              className={`${baseStyle} ${paddingLeft} ${paddingRight} ${style}`}
              pattern={type === 'number' ? '[0-9]*' : undefined}
              autoComplete={type === 'password' ? 'current-password' : 'off'}
              inputMode={type === 'number' ? 'numeric' : undefined}
              onKeyDown={(e) => {
                if (type === 'number') {
                  if (['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-', '.'].includes(e.key)) {
                    e.preventDefault();
                  }
                }
                if (onKeyDown) onKeyDown(e);
              }}
              min={type === 'date' ? min || new Date().toISOString().split('T')[0] : undefined}
              ref={ref}
            />
          )}
          <div
            className={`absolute ${showDropdown ? 'right-9' : 'right-3'}  top-1/2 -translate-y-1/2 flex items-center gap-2`}
          >
            {hasError ||
              (externalErrorMessage && (
                <span className="text-red">
                  <FaExclamationTriangle />
                </span>
              ))}

            {type === 'password' && (
              <span
                className="text-neutralDark cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </span>
            )}

            {rightContent &&
              type !== 'password' &&
              type !== 'date' &&
              type !== 'time' &&
              !showDropdown && <span className="text-neutralDark text-[14px]">{rightContent}</span>}
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

        {hasError || externalErrorMessage ? (
          <p id={`${id}-helper`} className="text-[13px] text-red">
            {error || externalErrorMessage}
          </p>
        ) : (
          <p id={`${id}-helper`} className="text-[13px] text-[#665B6D]">
            {helperText} <span className="text-purple underline cursor-pointer">{helperLink}</span>
          </p>
        )}
      </div>
    );
  },
);

export default DefaultInput;
