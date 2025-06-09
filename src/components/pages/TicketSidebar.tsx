
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
  const activeTicketIndex = currentTicket?.activeTicketIndex || 0;
  const savedTickets = currentTicket?.savedTickets || []; // Track which tickets have been saved

  // Create array of all ticket forms (saved + current active one)
  const allTicketForms = [
    ...tickets,
    // Always have at least one form
    ...(tickets.length === 0 ? [{ 
      id: `ticket-${Date.now()}`, 
      name: "", 
      type: "", 
      price: "", 
      category: "",
      purchaseLimit: "",
      stockAvailability: "",
      soldTarget: "",
      numberOfPeople: "",
      perks: [""]
    }] : [])
  ];

  const handleAddNewTicket = () => {
    // Add a new empty ticket form
    const newTicket = {
      id: `ticket-${Date.now()}`,
      name: "",
      type: "",
      price: "",
      category: "",
      purchaseLimit: "",
      stockAvailability: "",
      soldTarget: "",
      numberOfPeople: "",
      perks: [""]
    };

    const updatedTickets = [...tickets, newTicket];
    setFormValue("Tickets Create", "tickets", updatedTickets);
    setFormValue("Tickets Create", "activeTicketIndex", updatedTickets.length - 1);

    // Clear the main form for the new ticket
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

  const handleEditTicket = (ticketIndex: number) => {
    // Save current form data to the current ticket before switching
    const currentData = {
      name: currentTicket.ticketName || "",
      type: currentTicket.ticketType || "",
      category: currentTicket.ticketCategory || "",
      price: currentTicket.price || "",
      purchaseLimit: currentTicket.purchaseLimit || "",
      stockAvailability: currentTicket.stockAvailability || "",
      soldTarget: currentTicket.soldTarget || "",
      numberOfPeople: currentTicket.numberOfPeople || "",
      perks: currentTicket.perks || [""],
      ticketAvailability: currentTicket.ticketAvailability || "",
      salesStart: currentTicket.salesStart || "",
      startTime: currentTicket.startTime || "",
      salesEnd: currentTicket.salesEnd || "",
      endTime: currentTicket.endTime || ""
    };

    // Update current ticket in tickets array if it has data
    if (currentData.name || currentData.type) {
      const updatedTickets = [...tickets];
      updatedTickets[activeTicketIndex] = {
        ...currentData,
        id: tickets[activeTicketIndex]?.id || `ticket-${Date.now()}`
      };
      setFormValue("Tickets Create", "tickets", updatedTickets);
    }

    // Switch to the selected ticket form
    setFormValue("Tickets Create", "activeTicketIndex", ticketIndex);
    
    const ticketToEdit = allTicketForms[ticketIndex];
    if (ticketToEdit) {
      // Populate main form with the selected ticket's data
      setFormValue("Tickets Create", "ticketName", ticketToEdit.name || "");
      setFormValue("Tickets Create", "ticketType", ticketToEdit.type || "");
      setFormValue("Tickets Create", "ticketCategory", ticketToEdit.category || "");
      setFormValue("Tickets Create", "price", ticketToEdit.price || "");
      setFormValue("Tickets Create", "purchaseLimit", ticketToEdit.purchaseLimit || "");
      setFormValue("Tickets Create", "stockAvailability", ticketToEdit.stockAvailability || "");
      setFormValue("Tickets Create", "soldTarget", ticketToEdit.soldTarget || "");
      setFormValue("Tickets Create", "numberOfPeople", ticketToEdit.numberOfPeople || "");
      setFormValue("Tickets Create", "perks", ticketToEdit.perks || [""]);
      setFormValue("Tickets Create", "ticketAvailability", ticketToEdit.ticketAvailability || "");
      setFormValue("Tickets Create", "salesStart", ticketToEdit.salesStart || "");
      setFormValue("Tickets Create", "startTime", ticketToEdit.startTime || "");
      setFormValue("Tickets Create", "salesEnd", ticketToEdit.salesEnd || "");
      setFormValue("Tickets Create", "endTime", ticketToEdit.endTime || "");
    }

    onEditTicket?.(ticketToEdit.id);
  };

  const handleDeleteTicket = (ticketIndex: number) => {
    if (allTicketForms.length <= 1) {
      alert("At least one ticket type must be created");
      return;
    }

    // Remove the ticket from the array
    const updatedTickets = tickets.filter((_:any, index:any) => index !== ticketIndex);
    setFormValue("Tickets Create", "tickets", updatedTickets);
    
    // Adjust active index if necessary
    const newActiveIndex = ticketIndex === activeTicketIndex 
      ? Math.max(0, activeTicketIndex - 1)
      : activeTicketIndex > ticketIndex 
        ? activeTicketIndex - 1 
        : activeTicketIndex;
    
    setFormValue("Tickets Create", "activeTicketIndex", newActiveIndex);

    // Load the new active ticket data
    if (updatedTickets.length > 0) {
      handleEditTicket(newActiveIndex);
    } else {
      // Clear form if no tickets left
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
    }

    onDeleteTicket?.(allTicketForms[ticketIndex].id);
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
        {allTicketForms.length > 0 ? (
          allTicketForms.map((ticket, index) => {
            const isSaved = savedTickets.includes(ticket.id || `ticket-${index}`);
            return (
              <div
                key={ticket.id || index}
                className={`bg-white p-3 rounded border transition-colors ${
                  index === activeTicketIndex 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-black truncate">
                        {ticket.name || `Ticket ${index + 1}`}
                      </p>
                      {isSaved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          ✓ Saved
                        </span>
                      )}
                    </div>
                    {ticket.type && (
                      <p className="text-xs text-gray-500">
                        {ticket.type === "Free" ? "Free" : `₦${ticket.price?.toLocaleString() || "0"}`}
                      </p>
                    )}
                    {index === activeTicketIndex && !isSaved && (
                      <p className="text-xs text-primary font-medium">Currently editing</p>
                    )}
                    {index === activeTicketIndex && isSaved && (
                      <p className="text-xs text-amber-600 font-medium">Editing saved ticket</p>
                    )}
                  </div>
            )}

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleEditTicket(index)}
                    className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
                    title="Edit ticket"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                  {allTicketForms.length > 1 && (
                    <button
                      onClick={() => handleDeleteTicket(index)}
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

      {allTicketForms.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {allTicketForms.length} ticket{allTicketForms.length !== 1 ? 's' : ''} • Editing: {activeTicketIndex + 1}
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketSidebar;
