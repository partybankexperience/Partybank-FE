import { FaPlus } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import DefaultButton from "../../../components/buttons/DefaultButton";
import { CgLayoutGridSmall } from "react-icons/cg";
import { useState } from "react";
import { Modal } from "../../../components/modal/Modal";
import DefaultInput from "../../../components/inputs/DefaultInput";

const SeriesDetail = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventName, seteventName] = useState('')
    const mockEvents = [
        {
          id: 1,
          name: "Canvas and Beats",
          description: "Canvas & Beats is an innovative event that seamlessly blends.",
          imageUrl: "",
        },
        {
          id: 2,
          name: "Tech Flow Summit",
          description: "A forward-thinking event exploring AI and emerging tech trends.",
          imageUrl: "",
        },
        {
          id: 3,
          name: "Green Earth Expo",
          description: "An eco-friendly event promoting sustainability and innovation.",
          imageUrl: "",
        },
      ];
  return (
    <div className="md:bg-white md:rounded-md h-[80vh] w-full block md:grid mt-[.6rem] md:p-[25px] md:grid-cols-[2fr_3fr] gap-[20px]">
      <div className="rounded-md md:bg-[#F8F9F9] md:p-[20px] h-fit md:h-full ">
        <div className="rounded-[8px] bg-grey w-full h-[18rem]">
          <img src="" alt="" />
        </div>

        <div className="flex justify-between items-start gap-[20px] py-[20px] border-b border-[#E1E1E1]">
          <div className="grid ">
            <h1 className="text-black font-bold text-[1.2rem]">
              VIP Exclusive
            </h1>
            <p className="text-lightGrey font-medium text-[.875rem] flex items-center">
              3 videos{" "}
              <span className="text-[2rem]">
                <BsDot />
              </span>
              Updated today
            </p>
          </div>
          <button
            className="text-[1.2rem] cursor-pointer"
            aria-labelledby="Edit"
          >
            <BiEditAlt />
          </button>
        </div>
        <div className="flex justify-between items-start gap-[20px] py-[20px] ">
          <div className="grid ">
            <h1 className="text-lightGrey text-[.875rem]">Description:</h1>
            <p className="text-black font-medium text-[.9rem] flex items-center">
              Lagos Concerts 2025
            </p>
          </div>
          <button
            className="text-[1.2rem] cursor-pointer"
            aria-labelledby="Edit"
          >
            <BiEditAlt />
          </button>
        </div>
      </div>
      <div className="grid gap-[20px] h-fit ">
        <div className="flex justify-between items-center">
          <h1 className="text-black font-medium text-[1.2rem]">Event List</h1>
          <DefaultButton
            type="icon-left"
            className="!w-fit"
            icon={<FaPlus className="text-[.8rem] text-white" />}
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Event
          </DefaultButton>
        </div>
        <div className="grid gap-[20px]">
        {mockEvents.map((event) => (
        <div key={event.id} className="flex gap-[20px] items-center py-[20px] border-b border-[#E1E1E1]">
          <CgLayoutGridSmall className="text-black text-[2rem]" />
          <div className="rounded-md h-[5.9rem] w-[9.6rem] bg-almostBlack"></div>
          <div className="grid gap-2">
            <p className="text-black text-[1rem]">{event.name}</p>
            <p className="text-lightGrey text-[.8rem]">{event.description}</p>
          </div>
        </div>
      ))}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h1 className="text-[1.5rem] text-black font-medium text-center ">
        Add Event
        </h1>
        <DefaultInput id='eventName' value={eventName} label='Event Name' setValue={seteventName} placeholder="Search Event" classname="!w-full"/>
        <div className="md:mx-auto  grid md:flex  w-full  mt-[20px]">
          <DefaultButton
            type="default"
            variant="tertiary"
            className="!w-full md:!w-[9rem] md:!mx-auto border"
            onClick={() => {
                setIsModalOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-[9rem] md:!mx-auto"
            onClick={() => {
                // setIsModalOpen(false);
            }}
          >
            Create
          </DefaultButton>
        </div>
      </Modal>
    </div>
  );
};

export default SeriesDetail;
