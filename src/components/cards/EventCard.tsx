import { PiMapPinBold } from "react-icons/pi";
const EventCard = ({ progress }: any) => {
  return (
    <div className="rounded-[9px] border border-[#E1E1E1] ">
      <div className="h-[150px] rounded-t-[9px] w-full"></div>
      <div className=" grid">
        <div className="p-[15px] border-b border-[#E1E1E1] grid gap-[12px]">
          <div className="grid gap-[5px]">
            <p className="text-primary text-[12px]">
              12 Apr 2025 <span className="px-1 text-lightGrey">.</span>08:15 AM
              - 08:30 PM
            </p>
            <p className="text-black text-[18px] font-medium">
              Canvas and Beats
            </p>
          </div>
          <div className="flex items-center gap-[6px] text-lightGrey">
            <PiMapPinBold />
            <p className="text-[16px] font-medium">Landmark Centre</p>
          </div>
        </div>
        <div className="grid gap-[10px] p-[15px]">
          <div className="w-full h-[8px] bg-[#FCE3E8] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                //   width: `${progress}%`,
                width: `50%`,
                background: "linear-gradient(90deg, #e91c41 0%, #f16b83 100%)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div className="flex justify-between items-start">
            <div className="grid">
                <p className="text-lightGrey text-[12px]">Ticket Sold</p>
                <p className="text-[16px] font-bold">550</p>
            </div>
            <div className="grid">
            <p className="text-lightGrey text-[12px]">Total Ticket</p>
            <p className="text-[16px] font-bold">1,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
