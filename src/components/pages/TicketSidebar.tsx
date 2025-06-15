import { PiPlus } from "react-icons/pi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEventStore } from "../../stores/useEventStore";
import { useTicketStore } from "../../stores/useTicketStore";
import { useLocation } from "react-router-dom";
import { deleteTicket } from "../../Containers/ticketApi";
import { useEffect, useRef } from "react";

interface TicketSidebarProps {
  onAddTicket?: () => void;
  onEditTicket?: (ticketId: string) => void;
  onDeleteTicket?: (ticketId: string) => void;
}

const TicketSidebar = ({ onAddTicket, onEditTicket, onDeleteTicket }: TicketSidebarProps) => {
  const location = useLocation();

  // Context Detection
  const isCreateEventContext = location.pathname.includes('/dashboard/create-event');
  const isManageEventsContext = location.pathname.includes('/manage-events') && location.pathname.includes('/create-ticket');

  // Event Store (Create Event Context)
  const { form, setFormValue } = useEventStore();

  // Ticket Store (Manage Events Context)
  const { 
    tickets: manageTickets, 
    activeTicketIndex: manageActiveIndex, 
    addTicket: manageAddTicket,
    deleteTicket: manageDeleteTicket,
    setActiveTicket: manageSetActiveTicket,
    getCurrentTicketData
  } = useTicketStore();

  // Context-aware data
  const currentTicket = isCreateEventContext ? form["Tickets Create"] : null;
  const tickets = isCreateEventContext ? (currentTicket?.tickets || []) : manageTickets;
  const activeTicketIndex = isCreateEventContext ? (currentTicket?.activeTicketIndex || 0) : manageActiveIndex;
  const savedTickets = (tickets || [])
  .filter((ticket:any) => !!ticket.id)
  .map((ticket:any) => ticket.id);
  // const savedTickets = isCreateEventContext ? (currentTicket?.savedTickets || []) : []; // Track which tickets have been saved in create event context

  // Create array of all ticket forms (saved + current active one)
  const allTicketForms = isCreateEventContext ? [
    ...tickets,
    // Always have at least one form
    ...(tickets.length === 0 ? [{ 
      key: `ticket-${Date.now()}`, 
      name: "", 
      type: "", 
      price: "", 
      category: "",
      purchaseLimit: "",
      totalStock: "",
      soldTarget: "",
      groupSize: "",
      perks: [""],
      isUnlimited: "",
      salesStart: "",
      startTime: "",
      salesEnd: "",
      endTime: "",
      isSaved: false
    }] : [])
  ] : [
    ...tickets,
    // For manage events, show current form data as well
    ...(tickets.length === 0 ? [{
      key: `ticket-${Date.now()}`,
      name: getCurrentTicketData("ticketName") || "",
      type: getCurrentTicketData("ticketType") || "",
      price: getCurrentTicketData("price") || "",
      category: getCurrentTicketData("ticketCategory") || "",
      purchaseLimit: getCurrentTicketData("purchaseLimit") || "",
      totalStock: getCurrentTicketData("totalStock") || "",
      soldTarget: getCurrentTicketData("soldTarget") || "",
      groupSize: getCurrentTicketData("groupSize") || "",
      perks: getCurrentTicketData("perks") || [""],
      isUnlimited: getCurrentTicketData("isUnlimited") || "",
      salesStart: getCurrentTicketData("salesStart") || "",
      startTime: getCurrentTicketData("startTime") || "",
      salesEnd: getCurrentTicketData("salesEnd") || "",
      endTime: getCurrentTicketData("endTime") || "",
      isSaved: false
    }] : [])
  ];

  const handleAddNewTicket = () => {
    if (isCreateEventContext) {
      // Create Event Context: Use existing logic
      const newTicket = {
        key: `ticket-${Date.now()}`,
        name: "",
        type: "",
        price: "",
        category: "",
        purchaseLimit: "",
        totalStock: "",
        soldTarget: "",
        groupSize: "",
        perks: [""],
        isUnlimited: "",
        salesStart: "",
        startTime: "",
        salesEnd: "",
        endTime: "",
        isSaved: false
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
      setFormValue("Tickets Create", "totalStock", "");
      setFormValue("Tickets Create", "soldTarget", "");
      setFormValue("Tickets Create", "groupSize", "");
      setFormValue("Tickets Create", "perks", [""]);
      setFormValue("Tickets Create", "isUnlimited", "");
    } else if (isManageEventsContext) {
      // Manage Events Context: Use ticket store
      manageAddTicket();
    }

    onAddTicket?.();
  };

  const handleEditTicket = (ticketIndex: number) => {
    if (isCreateEventContext) {
      // Create Event Context: Use existing logic
      const currentData = {
        name: currentTicket?.ticketName || "",
        type: currentTicket?.ticketType || "",
        category: currentTicket?.ticketCategory || "",
        price: currentTicket?.price || "",
        purchaseLimit: currentTicket?.purchaseLimit || "",
        totalStock: currentTicket?.totalStock || "",
        soldTarget: currentTicket?.soldTarget || "",
        groupSize: currentTicket?.groupSize || "",
        perks: currentTicket?.perks || [""],
        isUnlimited: currentTicket?.isUnlimited || "",
        salesStart: currentTicket?.salesStart || "",
        startTime: currentTicket?.startTime || "",
        salesEnd: currentTicket?.salesEnd || "",
        endTime: currentTicket?.endTime || ""
      };

      // Update current ticket in tickets array if it has data
      if (currentData.name || currentData.type) {
        const updatedTickets = [...tickets];
        const currentTicketInArray = tickets[activeTicketIndex] || {};
        updatedTickets[activeTicketIndex] = {
          ...currentTicketInArray,
          ...currentData,
          id: currentTicketInArray.id || null,
          savedTicketId: currentTicketInArray.savedTicketId || null
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
        setFormValue("Tickets Create", "totalStock", ticketToEdit.totalStock || "");
        setFormValue("Tickets Create", "soldTarget", ticketToEdit.soldTarget || "");
        setFormValue("Tickets Create", "groupSize", ticketToEdit.groupSize || "");
        setFormValue("Tickets Create", "perks", ticketToEdit.perks || [""]);
        setFormValue("Tickets Create", "isUnlimited", ticketToEdit.isUnlimited || "");
        setFormValue("Tickets Create", "salesStart", ticketToEdit.salesStart || "");
        setFormValue("Tickets Create", "startTime", ticketToEdit.startTime || "");
        setFormValue("Tickets Create", "salesEnd", ticketToEdit.salesEnd || "");
        setFormValue("Tickets Create", "endTime", ticketToEdit.endTime || "");
      }
    } else if (isManageEventsContext) {
      // Manage Events Context: Use ticket store
      manageSetActiveTicket(ticketIndex);
    }

    const ticketToEdit = allTicketForms[ticketIndex];
    onEditTicket?.(ticketToEdit?.id);
  };

  const handleDeleteTicket = async (ticketIndex: number) => {
    const ticketId = currentTicket?.tickets?.[ticketIndex]?.id;
    if(ticketId){
      try {
        await deleteTicket(ticketId);
      } catch (error) {
        console.error("Error deleting ticket:", error);
        return; // Abort deletion from UI if API call fails
      }
    } else {
      //handle deleting and updating the ticket in the store
    }
  
    if (allTicketForms.length <= 1) {
      alert("At least one ticket type must be created");
      return;
    }
  
    if (isCreateEventContext) {
      const updatedTickets = tickets.filter((_:any, index:any) => index !== ticketIndex);
      setFormValue("Tickets Create", "tickets", updatedTickets);
  
      const newActiveIndex =
        activeTicketIndex === ticketIndex
          ? Math.max(0, activeTicketIndex - 1)
          : activeTicketIndex > ticketIndex
          ? activeTicketIndex - 1
          : activeTicketIndex;
  
      setFormValue("Tickets Create", "activeTicketIndex", newActiveIndex);
  
      if (updatedTickets.length > 0) {
        handleEditTicket(newActiveIndex);
      } else {
        // Reset form fields
        [
          "ticketName", "ticketType", "ticketCategory", "price",
          "purchaseLimit", "totalStock", "soldTarget",
          "groupSize", "perks", "isUnlimited"
        ].forEach(field => {
          setFormValue("Tickets Create", field, field === "perks" ? [""] : "");
        });
      }
    }
  
    if (isManageEventsContext) {
      manageDeleteTicket(ticketIndex);
    }
  
    onDeleteTicket?.(allTicketForms[ticketIndex].id);
  };
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isCreateEventContext || hasInitialized.current) return;
  
    const formValues = form["Tickets Create"];
    if (!formValues) return;
  
    const currentData = {
      name: formValues.ticketName || "",
      type: formValues.ticketType || "",
      category: formValues.ticketCategory || "",
      price: formValues.price || "",
      purchaseLimit: formValues.purchaseLimit || "",
      totalStock: formValues.totalStock || "",
      soldTarget: formValues.soldTarget || "",
      groupSize: formValues.groupSize || "",
      perks: formValues.perks || [""],
      isUnlimited: formValues.isUnlimited || "",
      salesStart: formValues.salesStart || "",
      startTime: formValues.startTime || "",
      salesEnd: formValues.salesEnd || "",
      endTime: formValues.endTime || ""
    };
  
    const hasData = Object.values(currentData).some(
      (value) => Array.isArray(value) ? value.some(v => v !== "") : value !== ""
    );
  
    if (!hasData) return;
  
    const updatedTickets = [...(formValues.tickets || [])];
    const currentTicketInArray = updatedTickets[formValues.activeTicketIndex || 0] || {};
  
    updatedTickets[formValues.activeTicketIndex || 0] = {
      ...currentTicketInArray,
      ...currentData,
      id: currentTicketInArray.id || null,
      savedTicketId: currentTicketInArray.savedTicketId || null
    };
  
    setFormValue("Tickets Create", "tickets", updatedTickets);
    hasInitialized.current = true;
  }, []);


  
  return (
    <div className="w-full md:w-[20rem] order-last md:order-none ">
      {/* Mobile: Horizontal scrollable cards */}
      <div className="block md:hidden mb-4 ">
        <div className="flex items-center justify-between mb-3 px-4 ">
          <h3 className="text-black font-semibold text-sm">Add Tickets ({allTicketForms.length})</h3>
          <button
            onClick={handleAddNewTicket}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Add new ticket"
          >
            <PiPlus className="text-sm" />
          </button>
        </div>

        <div className="flex gap-3  px-4 pb-2 overflow-x-auto max-w-[calc(100vw-2rem)]">
          {allTicketForms.map((ticket, index) => {
            const isSaved = isCreateEventContext 
              ? savedTickets.includes(ticket.id || `ticket-${index}`)
              : ticket.isSaved || false;
            return (
              <div
                key={ticket.id || index}
                onClick={() => handleEditTicket(index)}
                className={`flex-shrink-0 w-32 p-2 rounded-lg border transition-colors cursor-pointer ${
                  index === activeTicketIndex 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-xs font-medium text-black truncate mb-1">
                  {ticket.name || `Ticket ${index + 1}`}
                </div>
                {ticket.type && (
                  <div className="text-xs text-gray-600 mb-1">
                    {ticket.type === "Free" ? "Free" : `₦${ticket.price?.toLocaleString() || "0"}`}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  {isSaved && (
                    <span className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-green-100 text-green-800">
                      ✓
                    </span>
                  )}
                  {index === activeTicketIndex && (
                    <div className="text-xs text-primary font-medium">Active</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Vertical sidebar */}
      <div className="hidden md:block my-[1.875rem] h-fit p-[1.5rem] bg-[#F8F9F9] rounded-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-black font-semibold text-base"> Add Tickets</h3>
          <button
            onClick={handleAddNewTicket}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Add new ticket"
          >
            <PiPlus className="text-lg" />
          </button>
        </div>

        <div className="space-y-2">
          {allTicketForms.length > 0 ? (
            allTicketForms.map((ticket, index) => {
              const isSaved = isCreateEventContext 
                ? savedTickets.includes(ticket.id || `ticket-${index}`)
                : ticket.isSaved || false;
              return (
                <div
                  key={ticket.id || index}
                  className={`bg-white p-3 rounded-lg border transition-colors ${
                    index === activeTicketIndex 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-black truncate" 
                           title={ticket.name || `Ticket ${index + 1}`}>
                          {ticket.name || `Ticket ${index + 1}`}
                        </p>
                        {isSaved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      {ticket.type && (
                        <p className="text-xs text-gray-600 mb-1">
                          {ticket.type === "Free" ? "Free" : `₦${ticket.price?.toLocaleString() || "0"}`}
                        </p>
                      )}
                      {index === activeTicketIndex && (
                        <p className="text-xs text-primary font-medium">Currently editing</p>
                      )}
                      {/* {index === activeTicketIndex && isSaved && (
                        <p className="text-xs text-blue-600 font-medium">Active</p>
                      )} */}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditTicket(index)}
                        className="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors"
                        title="Edit ticket"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      {allTicketForms.length > 1 && (
                        <button
                          onClick={() => handleDeleteTicket(index)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete ticket"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No tickets created</p>
            </div>
          )}
        </div>

        {allTicketForms.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {allTicketForms.length} ticket{allTicketForms.length !== 1 ? 's' : ''} • Active: {activeTicketIndex + 1}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSidebar;