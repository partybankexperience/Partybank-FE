
import CreateTicketComponent from "../../../components/pages/CreateTicketComponent";

const CreateTicket = () => {
  
  return (
    <div className=" md:px-[11rem] md:py-[20px] bg-white rounded-md min-h-screen">
      <div className="md:my-[10px] p-[2rem]  bg-[#F8F9F9] rounded-md h-full">
        <h1 className="text-center text-black text-[1.2rem] font-bold">
          Tickets Create
        </h1>
        <CreateTicketComponent />
      </div>
    </div>
  );
};

export default CreateTicket;
