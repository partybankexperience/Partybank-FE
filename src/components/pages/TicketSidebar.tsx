
import { PiPlus } from "react-icons/pi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEventStore } from "../../stores/useEventStore";

interface TicketSidebarProps {
  onAddTicket?: () => void;
  onEditTicket?: (ticketId: string) => void;
  onDeleteTicket?: (ticketId: string) => void;
}

const TicketSidebar = ({ onAddTicket, onEditTicket, onDeleteTicket }: TicketSidebarProps) => {
  const { form } = useEventStore();
  const currentTicket = form["Tickets Create"];
  const tickets = currentTicket?.tickets || [];
  const ticketName = currentTicket?.ticketName;

  // If there's a current ticket being created/edited, include it in the list
  const allTickets = ticketName ? 
    [...tickets, { id: 'current', name: ticketName, type: currentTicket.ticketType, price: currentTicket.price }] : 
    tickets;

  const handleAddNewTicket = () => {
    onAddTicket?.();
  };

  const handleEditTicket = (ticketId: string) => {
    onEditTicket?.(ticketId);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (allTickets.length <= 1) {
      alert("At least one ticket type must be created");
      return;
    }
    onDeleteTicket?.(ticketId);
  };

  return (
    <div className="md:my-[30px] h-fit p-[1.5rem] bg-[#F8F9F9] rounded-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-black font-medium">Tickets</h3>
        <button
          onClick={handleAddNewTicket}
          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
          title="Add new ticket"
        >
          <PiPlus className="text-lg" />
        </button>
      </div>

      <div className="space-y-2">
        {allTickets.length > 0 ? (
          allTickets.map((ticket, index) => (
            <div
              key={ticket.id || index}
              className="bg-white p-3 rounded border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {ticket.name || "Unnamed Ticket"}
                  </p>
                  {ticket.type && (
                    <p className="text-xs text-gray-500">
                      {ticket.type === "free" ? "Free" : `₦${ticket.price?.toLocaleString() || "0"}`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleEditTicket(ticket.id || index.toString())}
                    className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                    title="Edit ticket"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id || index.toString())}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    title="Delete ticket"
                    disabled={allTickets.length <= 1}
                  >
                    <FaTrash className={`text-xs ${allTickets.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No tickets created</p>
          </div>
        )}
      </div>

      {allTickets.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {allTickets.length} ticket{allTickets.length !== 1 ? 's' : ''} created
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketSidebar;
