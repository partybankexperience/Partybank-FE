import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
type DropdownProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

const Dropdown = ({ options, selected, onChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="min-w-[90px] h-[38px] border border-gray-300 rounded-[6px] px-4 py-3 flex items-center justify-between gap-1 bg-white text-sm"
      >
        {selected}
        <RiArrowDownSLine className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-[6px] shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
