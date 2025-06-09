import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiMapPinBold } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { formatDate, formatTimeRange } from "../helpers/dateTimeHelpers";

const EventCard = ({
  name = "Canvas and Beats",
  location = "Landmark Centre",
  startDate = "2025-04-12T00:00:00.000Z",
  startTime = "",
  endTime = "",
  progress = 50,
  ticketSold = 550,
  totalTicket = 1000,
  onEdit,
  onDuplicate,
  onDelete,
  bannerImage = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
}: {
  name?: string;
  location?: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  progress?: number;
  ticketSold?: number;
  totalTicket?: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  bannerImage?: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const buttonOptions = [
    {
      name: "Edit",
      onClick: () => (onEdit ? onEdit() : navigate("/manage-events/:id")),
      icon: <LuPencilLine />,
    },
    {
      name: "Duplicate",
      onClick: () => onDuplicate?.(),
      icon: <FiCopy />,
    },
    {
      name: "Delete",
      onClick: () => onDelete?.(),
      icon: <AiOutlineDelete />,
    },
  ];

  // Format the date and time for display
  const formattedDate = formatDate(startDate);
  const timeDisplay = formatTimeRange(startTime, endTime);

  return (
    <div className="relative rounded-[9px] border min-h-fit border-[#E1E1E1] h-[347px] min-w-[180px] w-full hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300">
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

      <div className="h-[150px] rounded-t-[9px] w-full bg-gray-100" ><img src={bannerImage} alt={`${name} banner image`} className="w-full h-full object-cover rounded-t-[9px]" /></div>
      <div className="grid">
        <div className="p-[15px] border-b border-[#E1E1E1] grid gap-[12px]">
          <div className="grid gap-[5px]">
            <p className="text-primary text-[12px]">
              {formattedDate} <span className="px-1 text-lightGrey">.</span> {timeDisplay}
            </p>
            <p className="text-black text-[18px] font-medium truncate">{name}</p>
          </div>
          <div className="flex items-center gap-[6px] text-lightGrey">
            <PiMapPinBold />
            <p className="text-[16px] font-medium">{location}</p>
          </div>
        </div>
        <div className="grid gap-[10px] p-[15px]">
          <div className="w-full h-[8px] bg-[#FCE3E8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #e91c41 0%, #f16b83 100%)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div className="flex justify-between items-start">
            <div className="grid">
              <p className="text-lightGrey text-[12px]">Ticket Sold</p>
              <p className="text-[16px] font-bold">{ticketSold}</p>
            </div>
            <div className="grid">
              <p className="text-lightGrey text-[12px]">Total Ticket</p>
              <p className="text-[16px] font-bold">{totalTicket}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;