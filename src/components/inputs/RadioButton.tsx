
type RadioButtonProps = {
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  extraText?: string;
};

const RadioButton = ({
    label,
    value,
    name,
    checked,
    onChange,
    extraText,
    disabled = false,
  }: RadioButtonProps) => {
    return (
      <label className="inline-flex  gap-2 cursor-pointer text-[.8rem] font-[RedHat] text-black items-center md:items-start">
        <span className="relative h-[1rem] w-[1rem] flex items-center justify-center">
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            disabled={disabled}
            className="peer sr-only"
            aria-checked={checked}
          />
          <div
            className={`
              w-full h-full rounded-full border-[2px]
              ${disabled ? 'border-neutral' : 'border-primary'}
              flex items-center justify-center
            `}
          >
            <div
              className={`w-[.5rem] h-[.5rem] rounded-full transition-colors duration-200 ${
                checked ? 'bg-primary' : 'bg-transparent'
              }`}
            />
          </div>
        </span>
       <div className="grid h-fit text-[1rem] md:text-[.8rem]">
            <span >{label}</span>
            {extraText &&<span className="text-[.9rem] md:text-[.7rem] text-[#918F90]">{extraText}</span> }
        </div>
      </label>
    );
  };
  
  

export default RadioButton;
