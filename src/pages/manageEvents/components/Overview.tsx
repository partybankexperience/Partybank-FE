import ticket from "../../../assets/images/ticket.svg";
import DefaultButton from "../../../components/buttons/DefaultButton";
import { LuPencilLine } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const Overview = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = [
    { icon: <GrLocation className="text-primary" />, name: "Landmark Centre" },
    {
      icon: <MdOutlineCalendarMonth className="text-primary" />,
      name: "12 Apr 2025",
    },
    {
      icon: <FaRegClock className="text-primary" />,
      name: "8:15 AM - 08:30 PM",
    },
  ];
  const buttonOptions = [
      {
        name: "Edit",
        // onClick: () => (onEdit ? onEdit() : navigate("/manage-events/:id")),
        icon: <LuPencilLine />,
      },
      {
        name: "Duplicate",
        // onClick: () => onDuplicate?.(),
        icon: <FiCopy />,
      },
      {
        name: "Delete",
        // onClick: () => onDelete?.(),
        icon: <AiOutlineDelete />,
      },
    ];
  return (
    <div className="grid">
      <h1 className="text-black text-[1.6rem] font-medium">Overview</h1>
      <div className="grid md:grid-cols-[1fr_2fr] gap-[30px] mt-[20px]">
        <div className="rounded-[10px] h-[170px] md:h-[350px] ">
          <img
            src={ticket}
            alt="ticket"
            className="rounded-[10px]  h-[170px] md:h-[350px] w-full object-cover overflow-hidden"
          />
        </div>
        <div className="grid gap-[20px] h-fit">
          <div className="pb-[20px] grid gap-[20px] border-b border-b-[#EDEDED]">
            <div className="flex items-center justify-between h-fit">
              <h2 className="text-[1.3rem] font-bold">Canvas and Beats</h2>
              <DefaultButton
                variant="tertiary"
                type="icon-left"
                className="!w-fit border"
                icon={<LuPencilLine className="text-primary" />}
              >
                Edit
              </DefaultButton>
            </div>
            <p className="text-lightGrey text-[1rem]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled
            </p>
            <div className="flex flex-col md:flex-row gap-[16px] text-[1rem]">
              {location.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-black "
                >
                  {item.icon}
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-[20px] grid gap-[20px] border-b border-b-[#EDEDED]">
            <div className="flex items-center justify-between h-fit">
              <h3 className="text-[1.3rem] ">Tickets</h3>
              <DefaultButton
                variant="tertiary"
                type="icon-left"
                className="!w-fit border"
                icon={<FaPlus className="text-primary" />}
              >
                Create Ticket
              </DefaultButton>
            </div>
            <div className="flex gap-[20px] ">
              <div className="grid  border-[#E1E1E1] border rounded-[3px]  w-[14vw] h-[199px]">
              
<div className="bg-[#F8F9F9] w-full h-[140px] relative">
  <h4 className="text-black text-[1rem] font-medium p-[10px]">At the Gate</h4>
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
                    // option.onClick();
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
</div>
<div className="">penka</div>
              </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
