import CreateTicketComponent from "../../../components/pages/CreateTicketComponent";
import TicketSidebar from "../../../components/pages/TicketSidebar";

const CreateTicket = () => {
  return (
    <div className="grid md:flex gap-[20px] p-[1.3vw]">
      <div className="flex-1 bg-[#F8F9F9] rounded-md p-[2rem]">
        <CreateTicketComponent />
      </div>
      <TicketSidebar />
    </div>
  );
};

export default CreateTicket;