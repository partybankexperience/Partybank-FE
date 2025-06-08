
import { PiPlus } from "react-icons/pi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEventStore } from "../../stores/useEventStore";

interface TicketSidebarProps {
  onAddTicket?: () => void;
  onEditTicket?: (ticketId: string) => void;
  onDeleteTicket?: (ticketId: string) => void;
}

const TicketSidebar = ({ onAddTicket, onEditTicket, onDeleteTicket }: TicketSidebarProps) => {
  const { form, setFormValue } = useEventStore();
  const currentTicket = form["Tickets Create"];
  const tickets = currentTicket?.tickets || [];
  const ticketName = currentTicket?.ticketName;

  // If there's a current ticket being created/edited, include it in the list
  const allTickets = ticketName ? 
    [...tickets, { id: 'current', name: ticketName, type: currentTicket.ticketType, price: currentTicket.price }] : 
    tickets;

  const handleAddNewTicket = () => {
    // Save current ticket if there's data
    if (ticketName) {
      const newTicket = {
        id: Date.now().toString(),
        name: ticketName,
        type: currentTicket.ticketType,
        price: currentTicket.price,
        category: currentTicket.ticketCategory,
        purchaseLimit: currentTicket.purchaseLimit,
        stockAvailability: currentTicket.stockAvailability,
        soldTarget: currentTicket.soldTarget,
        numberOfPeople: currentTicket.numberOfPeople,
        perks: currentTicket.perks
      };

      const updatedTickets = [...tickets, newTicket];
      setFormValue("Tickets Create", "tickets", updatedTickets);
    }

    // Clear form for new ticket
    setFormValue("Tickets Create", "ticketName", "");
    setFormValue("Tickets Create", "ticketType", "");
    setFormValue("Tickets Create", "ticketCategory", "");
    setFormValue("Tickets Create", "price", "");
    setFormValue("Tickets Create", "purchaseLimit", "");
    setFormValue("Tickets Create", "stockAvailability", "");
    setFormValue("Tickets Create", "soldTarget", "");
    setFormValue("Tickets Create", "numberOfPeople", "");
    setFormValue("Tickets Create", "perks", [""]);
    setFormValue("Tickets Create", "ticketAvailability", "");

    onAddTicket?.();
  };

  const handleEditTicket = (ticketId: string) => {
    if (ticketId === 'current') {
      // Already editing current ticket
      return;
    }

    // Find the ticket to edit
    const ticketToEdit = tickets.find((ticket: any) => ticket.id === ticketId);
    if (ticketToEdit) {
      // Populate form with ticket data
      setFormValue("Tickets Create", "ticketName", ticketToEdit.name);
      setFormValue("Tickets Create", "ticketType", ticketToEdit.type);
      setFormValue("Tickets Create", "ticketCategory", ticketToEdit.category);
      setFormValue("Tickets Create", "price", ticketToEdit.price);
      setFormValue("Tickets Create", "purchaseLimit", ticketToEdit.purchaseLimit);
      setFormValue("Tickets Create", "stockAvailability", ticketToEdit.stockAvailability);
      setFormValue("Tickets Create", "soldTarget", ticketToEdit.soldTarget);
      setFormValue("Tickets Create", "numberOfPeople", ticketToEdit.numberOfPeople);
      setFormValue("Tickets Create", "perks", ticketToEdit.perks || [""]);

      // Remove ticket from saved tickets array
      const updatedTickets = tickets.filter((ticket: any) => ticket.id !== ticketId);
      setFormValue("Tickets Create", "tickets", updatedTickets);
    }

    onEditTicket?.(ticketId);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (ticketId === 'current') {
      // Clear current form
      setFormValue("Tickets Create", "ticketName", "");
      setFormValue("Tickets Create", "ticketType", "");
      setFormValue("Tickets Create", "ticketCategory", "");
      setFormValue("Tickets Create", "price", "");
      setFormValue("Tickets Create", "purchaseLimit", "");
      setFormValue("Tickets Create", "stockAvailability", "");
      setFormValue("Tickets Create", "soldTarget", "");
      setFormValue("Tickets Create", "numberOfPeople", "");
      setFormValue("Tickets Create", "perks", [""]);
      setFormValue("Tickets Create", "ticketAvailability", "");
    } else {
      // Remove ticket from saved tickets array
      const updatedTickets = tickets.filter((ticket: any) => ticket.id !== ticketId);
      setFormValue("Tickets Create", "tickets", updatedTickets);
    }

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
                  {allTickets.length > 1 && (
                    <button
                      onClick={() => handleDeleteTicket(ticket.id || index.toString())}
                      className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                      title="Delete ticket"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  )}
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
