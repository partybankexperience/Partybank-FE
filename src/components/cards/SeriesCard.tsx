import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
// import { PiMapPinBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
// import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const SeriesCard = ({
  title = "Canvas and Beats",
  description = "Landmark Centre",
  onEdit,
//   onDuplicate,
  onDelete,
}: {
  title?: string;
  description?:string;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const buttonOptions = [
    {
      name: "Edit",
      onClick: () => (onEdit ? onEdit() : navigate("/manage-events/:id")),
      icon: <LuPencilLine />,
    },
    // {
    //   name: "Duplicate",
    //   onClick: () => onDuplicate?.(),
    //   icon: <FiCopy />,
    // },
    {
      name: "Delete",
      onClick: () => onDelete?.(),
      icon: <AiOutlineDelete />,
    },
  ];

  return (
    <div className="relative rounded-[9px] border min-h-fit border-[#E1E1E1] h-fit min-w-[180px] w-full hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300">
      {/* Dropdown */}
      <div className="absolute top-[15px] right-[15px] z-10">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-[32px] h-[32px] p-[5px] rounded-[5px] cursor-pointer bg-white hover:bg-[#eaeaea] flex items-center justify-center"
        >
          <HiOutlineDotsVertical size={20} />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-[140px] z-20">
            {buttonOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setDropdownOpen(false);
                  option.onClick();
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

      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-100" />
      <div className="grid">
        <div className="grid gap-[8px] p-[20px]">
          <p className="text-black font-medium text-[1.125rem]">{title}</p>
          <p className="text-lightGrey font-medium text-[.875rem]">{description}</p>
        </div>
        {/* <div className="absolute bottom-5 left-5 flex items-center gap-2">
          <PiMapPinBold size={16} />
          <p className="text-lightGrey font-medium text-[.875rem]">Location</p>
        </div> */}
      </div>
    </div>
  );
};

export default SeriesCard;
