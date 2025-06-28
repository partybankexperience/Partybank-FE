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
    <label className="flex items-center gap-2 cursor-pointer">
      {/* 1. flex-none + fixed w/h so circle never flexes */}
      <span className="flex-none w-4 h-4 relative">
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
            w-full h-full rounded-full border-2
            ${disabled ? 'border-neutral' : 'border-primary'}
            flex items-center justify-center
          `}
        >
          <div
            className={`
              w-2 h-2 rounded-full transition-colors duration-200
              ${checked ? 'bg-primary' : 'bg-transparent'}
            `}
          />
        </div>
      </span>

      {/* 2. text stacked in a flex-col so it never distorts the circle */}
      <div className="flex flex-col leading-tight">
        <span className="text-[0.9rem] font-[RedHat] text-black">{label}</span>
        {extraText && <span className="text-[0.75rem] font-light text-[#918F90]">{extraText}</span>}
      </div>
    </label>
  );
};

export default RadioButton;
