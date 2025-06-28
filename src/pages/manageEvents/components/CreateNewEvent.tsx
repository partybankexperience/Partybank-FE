import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
const CreateNewEvent = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-[#FFF2F4] rounded-[10px] px-[20px] min-w-[180px] w-full min-h-fit md:h-[17.5rem] grid justify-center items-center cursor-pointer hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
      onClick={() => navigate('/dashboard/create-event')}
    >
      <div className="grid gap-[20px] text-center py-[20px]">
        <div className="bg-white rounded-[6px] p-[14px] h-fit w-fit m-auto">
          <FaPlus className="text-[32px] text-primary" />
        </div>
        <div className="grid gap-[8px] text-center">
          <p className="text-black font-medium text-[1.125rem]">Create New Event</p>
          <p className="text-lightGrey font-medium text-[.875rem]">
            Create an event to keep your occasions organized
          </p>
        </div>
      </div>
    </button>
  );
};

export default CreateNewEvent;
