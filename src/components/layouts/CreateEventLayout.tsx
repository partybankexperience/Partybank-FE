import { ToastContainer } from "react-toastify";
import { stages, useEventStore } from "../../stores/useEventStore";
import { PiPlus } from "react-icons/pi";

const CreateEventLayout = ({ children }: any) => {
  const { stage ,form, setFormValue} = useEventStore();

  const currentIndex = stages.indexOf(stage);
  return (
    <div className="md:py-[20px] bg-white rounded-md min-h-screen">
      <ToastContainer />
      <div className="rounded-md bg-[#FFF2F4] md:mx-[20px] py-[20px]">
        <div className="md:px-[7rem] flex justify-between items-center">
          {stages.map((label, index) => {
            const isActive = label === stage;
            const isCompleted = stages.indexOf(label) < currentIndex;

            return (
              <div className="flex-1 text-center relative" key={label}>
                <p
                  className={`hidden md:block text-[.9rem] whitespace-nowrap ${
                    isActive || isCompleted
                      ? "text-black font-semibold"
                      : "text-[#A7A5A6]"
                  }`}
                >
                  {label}
                </p>
                <div className="flex justify-center items-center mt-2">
                  <div
                    className={`w-[14px]  h-[14px] rounded-full border ${isActive?'border-primary':'border-[#E4D9DA]'}  ${
                       isCompleted && " bg-primary border-primary"
                    }`}
                  />
                </div>
                {index < stages.length - 1 && (
                  <div className="absolute top-[15px] right-[-50%] w-full h-[1px] bg-gray-300 z-[-1]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:justify-center flex gap-[20px]">
        <div className="md:my-[30px] p-[2rem] bg-[#F8F9F9] rounded-md h-full min-h-[calc(100vh-16rem)]">
          {children}
        </div>
        {stage === "Tickets Create" && (() => {
  return (
    <div className="md:my-[30px] h-fit p-[2rem] bg-[#F8F9F9] rounded-md">
      <p className="">Add another Ticket</p>
      <div className="border flex gap-2">
      {form["Tickets Create"]?.ticketName}
<PiPlus/>
      </div>
    </div>
  );
})()}

      </div>
    </div>
  );
};

export default CreateEventLayout;
