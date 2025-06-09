import { useNavigate } from "react-router"
import { errorAlert } from "../../components/alerts/ToastService"
import DefaultButton from "../../components/buttons/DefaultButton"
import CreateEventLayout from "../../components/layouts/CreateEventLayout"
import CreateTicketComponent from "../../components/pages/CreateTicketComponent"
import { stages, useEventStore } from "../../stores/useEventStore"
import { validateStage } from "../../utils/eventValidation"
import { createEvent, createTag, getScheduleandLocation, editEvent } from "../../Containers/eventApi"
import { createTicket } from "../../Containers/ticketApi"
import Accessibility from "./Accessibility"
import EventSetup from "./EventSetup"
import Guest from "./Guest"
import Notification from "./Notification"
import Review from "./Review"
import ScheduleEvent from "./ScheduleEvent"
import { useState, useEffect } from "react";
import { Storage } from "../../stores/InAppStorage"


const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const { stage, setStage, form, errors, setError, clearStageErrors, clearEventStorage, conditionalClearStorage, setFormValue } = useEventStore()
    const currentIndex = stages.indexOf(stage)
    const navigate = useNavigate()
    const eventId = Storage.getItem("eventId") || null;

  // Function to check if form data has changed
  const hasFormDataChanged = (currentData: any, originalData: any): boolean => {
    if (!originalData) return true;
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  // Store original form data when component mounts if editing
  useEffect(() => {
    if (eventId && form["Event Setup"] && !originalFormData) {
      setOriginalFormData(JSON.parse(JSON.stringify(form["Event Setup"])));
    }
  }, [eventId, form["Event Setup"], originalFormData]);

const goNext = async () => {
  try {
    const formData = form[stage] || {};

    if (stage === "Event Setup") {
      const errors: Record<string, string> = {};

      if (!formData.name?.trim()) errors.name = "Event Name is required";
      if (!formData.category?.trim()) errors.category = "Category is required";
      if (!formData.tags?.trim()) errors.tags = "Tag is required";
      if (!formData.contactNumber?.trim()) errors.contactNumber = "Contact Number is required";
      if (!formData.description?.trim()) errors.description = "Event Description is required";

      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
        const validationFn = (window as any).validateEventSetup;
        if (typeof validationFn === "function") validationFn();
        return;
      }

      clearStageErrors(stage);
      setIsCreatingEvent(true);

      let finalTagId: string | null = null;

      // ✅ If "Other", create new tag and use the returned ID
      if (formData.tags === "Other") {
        const newTagName = formData.newTagName.trim();
        const newTagDescription = formData.newTagDescription?.trim() || "";
        if (!newTagName) {
          errorAlert("Error", "Tag name is required");
          setIsCreatingEvent(false);
          return;
        }
        try {
          const res = await createTag(newTagName, newTagDescription);
          finalTagId = res.tagId;
        } catch (err) {
          console.error("Tag creation failed", err);
          errorAlert("Error", "Failed to create tag.");
          setIsCreatingEvent(false);
          return;
        }
      } else {
        // If not "Other", use selected tag ID (e.g., from a dropdown or existing value)
        finalTagId = formData.selectedTags || formData.tags; // whichever one holds the tag ID
      }

      let success;

      if (eventId) {
        // Check if data has changed before calling edit endpoint
        const dataHasChanged = hasFormDataChanged(formData, originalFormData);
        console.log("Data has changed:", dataHasChanged);
        console.log("Current data:", formData);
        console.log("Original data:", originalFormData);

        if (!dataHasChanged) {
          console.log("No changes detected, skipping API call");
          setIsCreatingEvent(false);
          if (currentIndex < stages.length - 1) {
            setStage(stages[currentIndex + 1]);
          }
          return;
        }

        // Edit existing event
        console.log("Editing existing event with ID:", eventId);
        success = await editEvent(
          eventId,
          formData.name,
          formData.description,
          formData.coverImage || "",
          [finalTagId],
          formData.contactNumber,
          formData.category,
          formData.seriesId || undefined
        );

        // Update original form data after successful edit
        if (success) {
          setOriginalFormData(JSON.parse(JSON.stringify(formData)));
        }
      } else {
        // Create new event
        console.log("Creating new event");
        success = await createEvent(
          formData.name,
          formData.description,
          formData.coverImage || "",
          [finalTagId],
          formData.contactNumber,
          formData.category,
          formData.seriesId || undefined
        );

        if (success && success.eventId) {
          Storage.setItem("eventId", success.eventId);
          setOriginalFormData(JSON.parse(JSON.stringify(formData)));
        }
      }

      setIsCreatingEvent(false);

      if (!success) {
        setError(stage, "general", "Failed to create event. Please try again.");
        return;
      }
      if (currentIndex < stages.length - 1) {
        setStage(stages[currentIndex + 1]);
      }
      return;
    }
    if(stage === "Schedule & Location") {
      try {
        // Validate Schedule & Location stage
        const { isValid, errors } = validateStage(stage, formData);
        if (!isValid) {
          Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
          return;
        }
        clearStageErrors(stage);

        const res= await getScheduleandLocation(
          eventId, 
          formData.eventType,
          formData.startDate, 
          formData.startTime, 
          formData.endTime, 
          !formData.showLocation, // isLocationTBA - boolean
          formData.venueName, 
          formData.address!==''&&formData.address,
          formData.endDate!==''&&formData.endDate, 
        );
        console.log(res, 'Schedule & Location response');
      } catch (error) {
        console.error("Error in Schedule & Location stage:", error);
        setError(stage, "general", "An unexpected error occurred. Please try again.");
        return;
      }
    }
    if (stage === "Tickets Create") {
      try {
        const tickets = formData.tickets || [];
        const activeIndex = formData.activeTicketIndex || 0;
        const savedTickets = formData.savedTickets || [];

        // Build current ticket object from form data
        const currentTicket = {
          name: formData.ticketName?.trim() || "",
          type: formData.ticketType || "",
          category: formData.ticketCategory || "",
          price: formData.price || "",
          purchaseLimit: formData.purchaseLimit || "",
          stockAvailability: formData.stockAvailability || "",
          soldTarget: formData.soldTarget || "",
          numberOfPeople: formData.numberOfPeople || "",
          perks: formData.perks || [""],
          ticketAvailability: formData.ticketAvailability || "",
          salesStart: formData.salesStart || "",
          startTime: formData.startTime || "",
          salesEnd: formData.salesEnd || "",
          endTime: formData.endTime || ""
        };

        // Check if current ticket is already saved
        const currentTicketId = tickets[activeIndex]?.id || `ticket-${activeIndex}`;
        const isCurrentTicketSaved = savedTickets.includes(currentTicketId);

        // Validate current ticket if it has a name or any filled fields
        const hasCurrentTicketData = currentTicket.name || currentTicket.type || currentTicket.category || 
                                   currentTicket.price || currentTicket.purchaseLimit || currentTicket.salesStart;

        if (hasCurrentTicketData && !isCurrentTicketSaved) {
          // Validate current ticket required fields
          if (!currentTicket.name) {
            setError(stage, "ticketName", "Ticket name is required");
            return;
          }
          if (!currentTicket.type) {
            setError(stage, "ticketType", "Ticket type is required");
            return;
          }
          if (!currentTicket.category) {
            setError(stage, "ticketCategory", "Ticket category is required");
            return;
          }
          if (currentTicket.type === "Paid" && (!currentTicket.price || Number(currentTicket.price) <= 0)) {
            setError(stage, "price", "Price is required for paid tickets");
            return;
          }
          if (!currentTicket.salesStart) {
            setError(stage, "salesStart", "Sales start date is required");
            return;
          }
          if (!currentTicket.startTime) {
            setError(stage, "startTime", "Start time is required");
            return;
          }
          if (!currentTicket.salesEnd) {
            setError(stage, "salesEnd", "Sales end date is required");
            return;
          }
          if (!currentTicket.endTime) {
            setError(stage, "endTime", "End time is required");
            return;
          }
          if (!currentTicket.purchaseLimit) {
            setError(stage, "purchaseLimit", "Purchase limit is required");
            return;
          }
          if (currentTicket.ticketAvailability === "limited" && (!currentTicket.stockAvailability || Number(currentTicket.stockAvailability) <= 0)) {
            setError(stage, "stockAvailability", "Stock availability is required for limited tickets");
            return;
          }
          if (currentTicket.category === "option2" && (!currentTicket.numberOfPeople || Number(currentTicket.numberOfPeople) <= 0)) {
            setError(stage, "numberOfPeople", "Number of people is required for group tickets");
            return;
          }

          clearStageErrors(stage);

          // Save current ticket to the tickets array
          let updatedTickets = [...tickets];
          updatedTickets[activeIndex] = {
            ...currentTicket,
            id: tickets[activeIndex]?.id || `ticket-${Date.now()}`
          };
          setFormValue("Tickets Create", "tickets", updatedTickets);

          // Create/update ticket via API only if not already saved
          try {
            const categoryMap: { [key: string]: string } = {
              "option1": "single",
              "option2": "group"
            };

            const salesStartISO = `${currentTicket.salesStart}T${currentTicket.startTime}:00Z`;
            const salesEndISO = `${currentTicket.salesEnd}T${currentTicket.endTime}:00Z`;

            await createTicket(
              eventId as string,
              currentTicket.name,
              categoryMap[currentTicket.category] || currentTicket.category,
              currentTicket.type.toLowerCase(),
              currentTicket.type === "Paid" ? Number(currentTicket.price) : 0,
              Number(currentTicket.purchaseLimit),
              currentTicket.ticketAvailability === "limited" ? Number(currentTicket.stockAvailability) : 999999,
              Number(currentTicket.soldTarget) || 0,
              salesStartISO,
              salesEndISO,
              currentTicket.startTime,
              currentTicket.endTime,
              Array.isArray(currentTicket.perks) ? currentTicket.perks.filter(perk => perk && perk.trim()) : [],
              false,
              false
            );

            // Mark ticket as saved
            const currentSavedTickets = formData.savedTickets || [];
            const ticketId = updatedTickets[activeIndex].id;
            if (!currentSavedTickets.includes(ticketId)) {
              setFormValue("Tickets Create", "savedTickets", [...currentSavedTickets, ticketId]);
            }
          } catch (error) {
            console.error("Error creating ticket:", error);
            setError(stage, "general", `Failed to create ticket: ${currentTicket.name}`);
            return;
          }

          // Check if there are more incomplete tickets to work on
          const allTicketForms = updatedTickets.length > 0 ? updatedTickets : [{}];
          let nextIncompleteIndex = -1;

          for (let i = 0; i < allTicketForms.length; i++) {
            if (i !== activeIndex) {
              const ticket = allTicketForms[i];
              if (!ticket.name || !ticket.type || !ticket.category) {
                nextIncompleteIndex = i;
                break;
              }
            }
          }

          // If there's another incomplete ticket, switch to it
          if (nextIncompleteIndex !== -1) {
            const nextTicket = allTicketForms[nextIncompleteIndex];
            setFormValue("Tickets Create", "activeTicketIndex", nextIncompleteIndex);

            // Load the next ticket's data into the form
            setFormValue("Tickets Create", "ticketName", nextTicket.name || "");
            setFormValue("Tickets Create", "ticketType", nextTicket.type || "");
            setFormValue("Tickets Create", "ticketCategory", nextTicket.category || "");
            setFormValue("Tickets Create", "price", nextTicket.price || "");
            setFormValue("Tickets Create", "purchaseLimit", nextTicket.purchaseLimit || "");
            setFormValue("Tickets Create", "stockAvailability", nextTicket.stockAvailability || "");
            setFormValue("Tickets Create", "soldTarget", nextTicket.soldTarget || "");
            setFormValue("Tickets Create", "numberOfPeople", nextTicket.numberOfPeople || "");
            setFormValue("Tickets Create", "perks", nextTicket.perks || [""]);
            setFormValue("Tickets Create", "ticketAvailability", nextTicket.ticketAvailability || "");
            setFormValue("Tickets Create", "salesStart", nextTicket.salesStart || "");
            setFormValue("Tickets Create", "startTime", nextTicket.startTime || "");
            setFormValue("Tickets Create", "salesEnd", nextTicket.salesEnd || "");
            setFormValue("Tickets Create", "endTime", nextTicket.endTime || "");

            return; // Stay on current stage to complete the next ticket
          }
        }

        // If no current ticket data and no tickets exist, require at least one
        const finalTickets = formData.tickets || [];
        if (finalTickets.length === 0 && !hasCurrentTicketData) {
          setError(stage, "ticketName", "At least one ticket must be created");
          return;
        }

        clearStageErrors(stage);

      } catch (error) {
        console.error("Error in Tickets Create stage:", error);
        setError(stage, "general", "An unexpected error occurred while creating tickets.");
        return;
      }
    }
    // Handle other stages
    const { isValid, errors } = validateStage(stage, formData);
    if (!isValid) {
      Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
      return;
    }
    clearStageErrors(stage);
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
    }
  } catch (error) {
    setIsCreatingEvent(false);
    console.error("Error in goNext:", error);
    setError(stage, "general", "An unexpected error occurred. Please try again.");
  }
};


  const goBack = () => {
    if (currentIndex > 0) {
      setStage(stages[currentIndex - 1])
    } else if (eventId) {
      // If editing an existing event, go back to manage events
      navigate('/dashboard/manage-events');
    }
  }

    useEffect(() => {
    // Only clear event storage when user navigates away from create event flow
    // Don't clear on page reload if there's an eventId
    const handleBeforeUnload = () => {
      // This only triggers when user closes browser/tab, not when navigating within app
      // Form data will be preserved by zustand persist
    };

    const handlePopState = () => {
      // This triggers when user uses browser back/forward buttons
      // Clear storage only if navigating completely away from create event
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/create-event')) {
        clearEventStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);

      // Use conditional clear - only clears if no eventId exists
      conditionalClearStorage();

      // Clean up eventId if leaving create event completely
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/create-event')) {
        Storage.removeItem("eventId");
      }
    };
  }, [clearEventStorage]);
  return (
    <CreateEventLayout>
  <div className="flex flex-col min-h-[calc(100vh-20rem)] px-4 py-6">
    {/* Content area */}
    <div className="flex-grow">
      <h1 className="text-center text-black text-[1.2rem] font-bold">{stage}</h1>

      {stage === "Event Setup" && <EventSetup />}
      {stage === "Schedule & Location" && <ScheduleEvent />}
      {stage === "Tickets Create" && <CreateTicketComponent />}
      {stage === "Accessibility" && <Accessibility />}
      {stage === "Notifications" && <Notification />}
      {stage === "Event Guests" && <Guest />}
      {stage === "Review & Publish" && <Review />}
    </div>

    {/* Buttons at the bottom */}
    <div className="flex gap-3 mt-auto justify-center pt-6">
      {(currentIndex > 0 || eventId) && (
        <DefaultButton variant="secondary" onClick={goBack} className="border !bg-white">
          Back
        </DefaultButton>
      )}
{stage !== "Review & Publish"? (

      <DefaultButton onClick={goNext} isLoading={isCreatingEvent}>
        {stage === "Event Setup" && isCreatingEvent 
          ? (eventId ? "Updating Event..." : "Creating Event...") 
          : "Next"}
      </DefaultButton>
):(
  <DefaultButton variant="primary" onClick={() => {
    // Clear storage when publishing event (completing the flow)
    clearEventStorage();
    // Clear eventId
    Storage.removeItem("eventId");
    navigate("/dashboard");
  }}>
  Publish Event
</DefaultButton>
)}
    </div>
  </div>
</CreateEventLayout>

  )
}

export default CreateEvent