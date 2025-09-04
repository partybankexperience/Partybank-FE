import { useState, useEffect, forwardRef } from 'react';
import { FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type DefaultInputProps = {
  id: string;
  label: string;
  value: any;
  setValue: (v: any) => void;

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
  classname?: string;

  setExternalError?: (error: boolean) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;

  min?: string;
  externalErrorMessage?: string | null;

  /** ✅ new / explicit HTML features */
  autoComplete?: string;
  name?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  maxLength?: number;

  /** ✅ behavior toggles */
  digitsOnly?: boolean; // force digits-only input (defaults to true for type="tel")
  allowPlus?: boolean; // allow leading '+' (e.g. international phone), only used when digitsOnly is true
};

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
      autoComplete,
      name,
      inputMode,
      pattern,
      maxLength,
      digitsOnly,
      allowPlus = false,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    // Treat tel as digits-only by default (can be overridden via digitsOnly prop)
    const isDigitsOnly = digitsOnly ?? type === 'tel';

    // Keep your previous number->tel display hack for showing numeric keypad
    const inputType =
      type === 'password' && showPassword ? 'text' : type === 'number' ? 'tel' : type;

    const stringValue = String(value ?? '');
    const isFilled = stringValue.trim().length > 0;
    const hasError = !!error;

    const computedAutoComplete =
      typeof autoComplete === 'string'
        ? autoComplete
        : type === 'password'
          ? 'current-password'
          : undefined;

    const sanitizeDigits = (raw: string) => {
      if (!isDigitsOnly) return raw;

      if (allowPlus) {
        // Allow a single leading +
        let s = raw.replace(/[^\d+]/g, '');
        // Keep only the first leading '+'
        s = s.startsWith('+') ? '+' + s.slice(1).replace(/\+/g, '') : s.replace(/\+/g, '');
        return s;
      }
      return raw.replace(/\D+/g, '');
    };

    const validate = () => {
      if (disabled) return null;
      if (required && stringValue.trim() === '') return 'This field is required.';
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue))
        return 'Please enter a valid email.';
      if (type === 'password') {
        if (stringValue.length < 8) return 'Password must be at least 8 characters.';
        if (!/[a-z]/.test(stringValue) || !/[A-Z]/.test(stringValue))
          return 'Password must contain a mix of uppercase and lowercase letters.';
        if (!/\d/.test(stringValue)) return 'Password must contain at least one number.';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(stringValue))
          return 'Password must contain at least one special character.';
      }
      // For digitsOnly fields, the sanitizer already ensures digits; no extra error here
      return null;
    };

    useEffect(() => {
      if (touched) setError(validate());
      const validationError = validate();
      if (setExternalError) setExternalError(!!validationError);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleBlur = (e: any) => {
      setTouched(true);
      setError(validate());
      onBlur?.(e);
    };

    // Prevent invalid typing for digits-only
    const guardKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (isDigitsOnly) {
        const allowedControlKeys = new Set([
          'Backspace',
          'Delete',
          'Tab',
          'Escape',
          'Enter',
          'ArrowLeft',
          'ArrowRight',
          'Home',
          'End',
        ]);
        const isCtrlCombo = e.ctrlKey || e.metaKey;
        if (allowedControlKeys.has(e.key) || isCtrlCombo) {
          onKeyDown?.(e);
          return;
        }

        // Digits
        if (/^\d$/.test(e.key)) {
          onKeyDown?.(e);
          return;
        }

        // Optional single leading '+'
        if (allowPlus && e.key === '+') {
          const target = e.target as HTMLInputElement;
          const hasPlus = (target.value as string).includes('+');
          const caretAtStart = target.selectionStart === 0 && target.selectionEnd === 0;
          if (!hasPlus && caretAtStart) {
            onKeyDown?.(e);
            return;
          }
        }

        // Block everything else
        e.preventDefault();
        return;
      }

      // Your previous number guard
      if (type === 'number') {
        if (['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-', '.'].includes(e.key)) {
          e.preventDefault();
          return;
        }
      }
      onKeyDown?.(e);
    };

    // Block invalid input via IME/text insertions
    const handleBeforeInput: React.FormEventHandler<HTMLInputElement> = (e: any) => {
      if (!isDigitsOnly) return;
      const data: string | null = e.data ?? null;
      if (!data) return;
      const cleaned = sanitizeDigits(data);
      if (cleaned !== data) e.preventDefault();
    };

    // Sanitize paste
    const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
      if (!isDigitsOnly) return;
      const pasted = e.clipboardData.getData('text');
      const cleaned = sanitizeDigits(pasted);
      if (cleaned !== pasted) {
        e.preventDefault();
        // manual insert of cleaned
        const target = e.target as HTMLInputElement;
        const start = target.selectionStart ?? target.value.length;
        const end = target.selectionEnd ?? target.value.length;
        const newVal = target.value.slice(0, start) + cleaned + target.value.slice(end);
        setValue(newVal);
      }
    };

    const baseStyle = `box-border appearance-none text-[14px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[14px] font-[RedHat] rounded-[4px] py-[10px] px-[16px] w-full md:w-[20rem] flex items-center ${classname}
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
      <div className="grid gap-1 w-full relative">
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
                name={name || id}
                disabled={disabled}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                aria-describedby={`${id}-helper`}
                aria-invalid={hasError}
                autoComplete={computedAutoComplete}
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

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutralDark text-sm">
                <FaChevronDown />
              </div>
            </div>
          ) : (
            <input
              id={id}
              name={name || id}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onChange={(e) => {
                if (type === 'number') {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  const numericValue = cleaned === '' ? '' : Number(cleaned);
                  setValue(numericValue);
                } else if (isDigitsOnly) {
                  const cleaned = sanitizeDigits(e.target.value);
                  setValue(cleaned);
                } else {
                  setValue(e.target.value);
                }
              }}
              onBlur={handleBlur}
              onKeyDown={guardKeyDown}
              onBeforeInput={handleBeforeInput}
              onPaste={handlePaste}
              aria-describedby={`${id}-helper`}
              aria-invalid={hasError}
              className={`${baseStyle} ${paddingLeft} ${paddingRight} ${style}`}
              // Pattern only validates; we still pass it for HTML form semantics
              pattern={pattern ?? (isDigitsOnly ? (allowPlus ? '\\+?\\d*' : '\\d*') : undefined)}
              autoComplete={computedAutoComplete}
              inputMode={
                inputMode ??
                (isDigitsOnly
                  ? 'numeric'
                  : type === 'number'
                    ? 'numeric'
                    : type === 'tel'
                      ? 'tel'
                      : undefined)
              }
              min={type === 'date' ? min || new Date().toISOString().split('T')[0] : undefined}
              maxLength={maxLength}
              ref={ref}
            />
          )}

          <div
            className={`absolute ${showDropdown ? 'right-9' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center gap-2`}
          >
            {(hasError || externalErrorMessage) && (
              <span className="text-red">
                <FaExclamationTriangle />
              </span>
            )}

            {type === 'password' && (
              <span
                className="text-neutralDark cursor-pointer"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </span>
            )}

            {rightContent &&
              type !== 'password' &&
              type !== 'date' &&
              type !== 'time' &&
              !showDropdown && <span className="text-neutralDark text-[14px]">{rightContent}</span>}
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
