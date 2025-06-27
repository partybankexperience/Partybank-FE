import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface ButtonOption {
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface TicketsCardProps {
  title: string;
  availability: string;
  capacity: number | string;
  price: string;
  buttonOptions?: ButtonOption[];
  isNotEditable?: boolean; // Optional prop to control editability
}

const TicketsCard: React.FC<TicketsCardProps> = ({
  title,
  availability,
  capacity,
  price,
  buttonOptions = [],
  isNotEditable,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  return (
    <div className="grid border-[#E1E1E1] border rounded-lg w-fit md:min-w-[14vw] h-full min-h-[199px]">
      <div className="bg-[#F8F9F9] w-full min-h-[140px] relative py-[13px] px-[15px] pb-[23px] border-b-2 border-dotted border-b-[#E1E1E1]">
        <h4 className="text-black text-[1rem] font-bold">{title}</h4>
        {!isNotEditable && (
          <div className="absolute top-[15px] right-[15px] z-10" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-[32px] h-[32px] p-[5px] rounded-[5px] cursor-pointer bg-white hover:bg-[#eaeaea] flex items-center justify-center"
            >
              <HiOutlineDotsVertical size={20} />
            </button>

            {dropdownOpen && buttonOptions.length > 0 && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-[140px] z-20">
                {buttonOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDropdownOpen(false);
                      option.onClick?.();
                    }}
                    className="items-center cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex gap-2"
                  >
                    {option.icon}
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-[1.5rem] mt-[17px]">
          <div className="grid gap-1 font-medium text-[.875rem]">
            <p className="text-[#918F90] break-words">
              Stock <br /> Availability
            </p>
            <p className="text-black break-words">{availability}</p>
          </div>
          <div className="grid gap-1 font-medium text-[.875rem]">
            <p className="text-[#918F90] break-words">
              Total <br /> Capacity
            </p>
            <p className="text-black">{capacity}</p>
          </div>
        </div>
      </div>

      <div className="py-[20px] px-[15px] flex items-center justify-between font-medium">
        <p className="text-[1rem] text-[#918F90]">Price:</p>
        <p className="text-[1.125rem] text-black">{price}</p>
      </div>
    </div>
  );
};

export default TicketsCard;
