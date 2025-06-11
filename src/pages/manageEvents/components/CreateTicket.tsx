
import CreateTicketComponent from "../../../components/pages/CreateTicketComponent";
import TicketSidebar from "../../../components/pages/TicketSidebar";


const CreateTicket = () => {
  
  return (
    <div className=" md:px-[3rem]  bg-white rounded-md min-h-screen grid md:flex gap-[20px]">
      <div className="md:my-[10px] p-[2rem]  bg-[#F8F9F9] rounded-md h-full  md:my-[30px]">
        <h1 className="text-center text-black text-[1.2rem] font-bold">
          Tickets Create
        </h1>
        
        <CreateTicketComponent />
        
      </div>
        <TicketSidebar />
    </div>
  );
};

export default CreateTicket;
