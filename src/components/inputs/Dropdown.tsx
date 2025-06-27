import { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";

type DropdownProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
};

const Dropdown = ({
  options,
  selected,
  onSelect,
  className = "",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (ref.current && !ref.current.contains(evt.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="min-w-[90px] h-[38px] border border-gray-300 rounded-[6px] px-4 flex items-center justify-between bg-white cursor-pointer"
      >
        <span className="text-sm">{selected}</span>
        <RiArrowDownSLine className="w-4 h-4 text-gray-600" />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-[6px] shadow-lg z-10">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;