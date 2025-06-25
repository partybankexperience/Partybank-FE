import { ToastContainer } from "react-toastify";
import { stages, useEventStore } from "../../stores/useEventStore";
import TicketSidebar from "../pages/TicketSidebar";

const CreateEventLayout = ({ children }: any) => {
  const { stage } = useEventStore();

  const currentIndex = stages.indexOf(stage);
  return (
    <div className="md:py-[20px] bg-white rounded-md min-h-screen">
      <ToastContainer />
      <div className="rounded-md bg-[#FFF2F4] md:mx-[20px] grid px-auto py-[20px]">
        <div className="flex justify-center gap-1 items-center">
          {stages.map((label, index) => {
            const isActive = label === stage;
            const isCompleted = stages.indexOf(label) < currentIndex;

            return (
              <div className="flex-1 text-center relative min-w-[5rem] group" key={label}>
                <p
                  className={`hidden lg:block text-[.8rem] truncate mx-auto ${
                    isActive || isCompleted
                      ? "text-black font-semibold"
                      : "text-[#A7A5A6]"
                  }`}
                  title={label}
                >
                  {label}
                </p>
                <div className="flex justify-center items-center mt-2 relative">
                  <div
                    className={`w-[.7rem] h-[.7rem] rounded-full border cursor-pointer ${
                      isActive ? "border-primary" : "border-[#E4D9DA]"
                    } ${isCompleted && " bg-primary border-primary"}`}
                    title={label}
                  />
                  {/* Tooltip for small and medium screens */}
                  <div className="lg:hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="absolute top-[15px] right-[-50%] w-full h-[1px] bg-gray-300 z-[-1]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>


      <div className={` ${stage=== "Tickets Create"?'md:px-[3rem]':'md:px-[3rem] lg:px-[11rem]'}`}>
        <div className="grid md:flex gap-[20px]">
          
          <div className="flex-1 md:my-[1.875rem] md:p-[2rem] bg-[#F8F9F9] rounded-md h-full ">
            {children}
          </div>
          
        {stage === "Tickets Create" && (
          <TicketSidebar />
        )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventLayout;