import { useNavigate } from "react-router"
import { errorAlert } from "../../components/alerts/ToastService"
import DefaultButton from "../../components/buttons/DefaultButton"
import CreateEventLayout from "../../components/layouts/CreateEventLayout"
import CreateTicketComponent from "../../components/pages/CreateTicketComponent"
import { stages, useEventStore } from "../../stores/useEventStore"
import { validateStage } from "../../utils/eventValidation"
import { createEvent, editEvent, getScheduleandLocation, accessibility, notification, createTag, publishEvent } from "../../Containers/eventApi"
import { editTicket,createTicketByEventId } from "../../Containers/ticketApi"
import Accessibility from "./Accessibility"
import EventSetup from "./EventSetup"
import Guest from "./Guest"
import Notification from "./Notification"
import Review from "./Review"
import ScheduleEvent from "./ScheduleEvent"
import { useState, useEffect } from "react";
import { Storage } from "../../stores/InAppStorage"


const CreateEvent = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const { stage, setStage, form, setError, clearStageErrors, clearEventStorage, conditionalClearStorage, setFormValue, isNextButtonDisabled } = useEventStore()
    const currentIndex = stages.indexOf(stage)
    const navigate = useNavigate()
    const eventId = Storage.getItem("eventId") || null;
    let slug = "";

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
        const isValid = (window as any).validateEventSetup?.();
    if (!isValid) return;

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
        if(formData.coverImage ===''|| formData.coverImage === undefined) {
          setFormValue(stage, "coverImage", "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
          
        
}
console.log("Cover image:", formData.coverImage);
        success = await editEvent(
          eventId,
          formData.name,
          formData.description,
          formData.coverImage ,
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
        if(formData.coverImage ===''|| formData.coverImage === undefined) {
          setFormValue(stage, "coverImage", "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
          
        
}
        console.log("Creating new event");
        success = await createEvent(
          formData.name,
          formData.description,
          formData.coverImage ,
          [finalTagId],
          formData.contactNumber,
          formData.category,
          formData.seriesId || undefined
        );

        if (success && success.eventId) {
          Storage.setItem("eventId", success.eventId);
          slug = success.slug;
          setOriginalFormData(JSON.parse(JSON.stringify(formData)));
        }
      }

      setIsCreatingEvent(false);

      if (!success) {
        setError(stage, "general", "Failed to create event. Please try again.");
        errorAlert("Error", "Please fill in the form correctly.");

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
          const isValid = (window as any).validateScheduleEvent?.();
          if (!isValid) return;
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
        errorAlert("Error", "Please fill in the form correctly.");

        setError(stage, "general", "An unexpected error occurred. Please try again.");
        return;
      }
    }
    if (stage === "Tickets Create") {
      try {
        const tickets = formData.tickets || [];
        const activeIndex = formData.activeTicketIndex || 0;
        // const savedTickets = formData.savedTickets || [];
        const savedTickets = (formData.tickets || [])
  .filter((ticket:any) => !!ticket.id)
  .map((ticket:any) => ticket.id);

        const existingTicket = tickets[activeIndex] || {};

        console.log(tickets, 'tickets from the form data');

        // Map category values to proper format before storing
        const categoryMap: { [key: string]: string } = {
          option1: "single",
          option2: "group",
        };

        const currentTicket = {
          name: formData.ticketName?.trim() || "",
          type: formData.ticketType || "",
          category: categoryMap[formData.ticketCategory] || formData.ticketCategory || "",
          price: formData.price || "",
          purchaseLimit: formData.purchaseLimit || "",
          totalStock: formData.totalStock || "",
          soldTarget: formData.soldTarget || "",
          groupSize: formData.groupSize || "",
          perks: formData.perks || [""],
          isUnlimited: formData.isUnlimited || "",
          salesStart: formData.salesStart || "",
          startTime: formData.startTime || "",
          salesEnd: formData.salesEnd || "",
          endTime: formData.endTime || "",
          savedTicketId: existingTicket.savedTicketId || null,
          id: existingTicket.id ,
          color: formData.color || ""
        };

        const currentTicketId = currentTicket.id;
        // const isCurrentTicketSaved = savedTickets.includes(currentTicketId);

        const hasCurrentTicketData = Object.values({
          name: currentTicket.name,
          type: currentTicket.type,
          category: currentTicket.category,
          price: currentTicket.price,
          purchaseLimit: currentTicket.purchaseLimit,
          salesStart: currentTicket.salesStart
        }).some(Boolean);

        const validateTicket = () => {
          let isValid = true;
        
          if (!currentTicket.name) {
            setError(stage, "ticketName", "Ticket name is required");
            isValid = false;
          }
        
          if (!currentTicket.type) {
            setError(stage, "ticketType", "Ticket type is required");
            isValid = false;
          }
        
          if (!currentTicket.category) {
            setError(stage, "ticketCategory", "Ticket category is required");
            isValid = false;
          }
          if (!currentTicket.totalStock && currentTicket.isUnlimited===true ) {
            setError(stage, "totalStock", "Total stock is required for limited tickets");
            isValid = false;
          }
          if (!currentTicket.soldTarget) {
            setError(stage, "soldTarget", "Ticket sold target is required");
            isValid = false;
          }
          if (
            currentTicket.type === "Paid" &&
            (!currentTicket.price || Number(currentTicket.price) <= 0)
          ) {
            setError(stage, "price", "Price is required for paid tickets");
            isValid = false;
          }
        
          if (!currentTicket.salesStart) {
            setError(stage, "salesStart", "Sales start date is required");
            isValid = false;
          }
        
          if (!currentTicket.startTime) {
            setError(stage, "startTime", "Start time is required");
            isValid = false;
          }
        
          if (!currentTicket.salesEnd) {
            setError(stage, "salesEnd", "Sales end date is required");
            isValid = false;
          }
        
          if (!currentTicket.endTime) {
            setError(stage, "endTime", "End time is required");
            isValid = false;
          }
        
          if (!currentTicket.purchaseLimit) {
            setError(stage, "purchaseLimit", "Purchase limit is required");
            isValid = false;
          }
        
          if (
            currentTicket.isUnlimited === "limited" &&
            (!currentTicket.totalStock || Number(currentTicket.totalStock) <= 0)
          ) {
            setError(stage, "totalStock", "Stock availability is required for limited tickets");
            isValid = false;
          }
        
          if (
            currentTicket.category === "group" &&
            (!currentTicket.groupSize || Number(currentTicket.groupSize) <= 0)
          ) {
            setError(stage, "groupSize", "Number of people is required for group tickets");
            isValid = false;
          }
        
          return isValid;
        };
        
        if (hasCurrentTicketData) {
          if (validateTicket() !== true) return;
          clearStageErrors(stage);

          const updatedTickets = [...tickets];
          updatedTickets[activeIndex] = { ...existingTicket, ...currentTicket };
          setFormValue(stage, "tickets", updatedTickets);

          try {
            const currentTicketInArray = updatedTickets[activeIndex];

            const perksArray = Array.isArray(currentTicket.perks)
              ? currentTicket.perks.filter(p => p && p.trim())
              : [];

// Validate Ticket stage
const { isValid, errors } = validateStage(stage, formData);
if (!isValid) {
  Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
  const isValid = (window as any).validateTicketsCreate?.();
  if (!isValid) return;
  return;
}
            const ticketPayload = [
              eventId as string,
              currentTicket.name,
              categoryMap[currentTicket.category] || currentTicket.category,
              currentTicket.type.toLowerCase(),
              currentTicket.type === "Paid" ? Number(currentTicket.price) : 0,
              Number(currentTicket.purchaseLimit),
              !currentTicket.isUnlimited
                ? Number(currentTicket.totalStock):0,

              Number(currentTicket.soldTarget) || 0,
              currentTicket.salesStart,
              currentTicket.salesEnd,
              currentTicket.startTime,
              currentTicket.endTime,
              perksArray,
              currentTicket.isUnlimited,
              currentTicket.category === "group" ? Number(currentTicket.groupSize) : undefined,
              currentTicket.color || ""
            ]as const;

            const response =currentTicketId
              ? await editTicket(currentTicketId, ...ticketPayload)
              : await createTicketByEventId(...ticketPayload);

            if (!currentTicketInArray?.savedTicketId && response?.ticketId) {
              updatedTickets[activeIndex] = {
                ...updatedTickets[activeIndex],
                // savedTicketId: response.ticketId
                id: response.ticketId,
              };
              setFormValue(stage, "tickets", updatedTickets);
            }

          } catch (error) {
            console.error("Error creating/updating ticket:", error);
            setError(stage, "general", `Failed to save ticket: ${currentTicket.name}`);
            return;
          }

          const updatedSavedTickets = [...savedTickets];
          if (!updatedSavedTickets.includes(currentTicketId)) {
            updatedSavedTickets.push(currentTicketId);
            setFormValue(stage, "savedTickets", updatedSavedTickets);
          }

          // Check for remaining tickets with empty or null id
          const nextUnsavedIndex = updatedTickets.findIndex((ticket, index) =>
            index !== activeIndex && 
            (!ticket.id || ticket.id === '' || ticket.id === null)
          );

          if (nextUnsavedIndex !== -1) {
            // Move to next unsaved ticket
            const nextTicket = updatedTickets[nextUnsavedIndex];
            setFormValue(stage, "activeTicketIndex", nextUnsavedIndex);

            // Load the next ticket's data into the form
            Object.entries(nextTicket).forEach(([key, value]) => {
              if (key === 'name') setFormValue(stage, 'ticketName', value ?? "");
              else if (key === 'type') setFormValue(stage, 'ticketType', value ?? "");
              else if (key === 'category') setFormValue(stage, 'ticketCategory', value ?? "");
              else if (key !== 'id' && key !== 'savedTicketId' && key !== 'key' && key !== 'isSaved') {
                setFormValue(stage, key, value ?? (key === "perks" ? [""] : ""));
              }
            });

            console.log(`Moved to next unsaved ticket at index ${nextUnsavedIndex}`);
            return; // Stay on current stage to edit the next unsaved ticket
          }
        }

        if ((formData.tickets || []).length === 0 && !hasCurrentTicketData) {
          errorAlert("Error", "At least one ticket must be created");
          setError(stage, "ticketName", "At least one ticket must be created");
          return;
        }

        clearStageErrors(stage);

      } catch (error) {
        console.error("Error in Tickets Create stage:", error);
        errorAlert("Error", "Please fill in the form correctly.");
        setError(stage, "general", "An unexpected error occurred while creating tickets.");
      }
    }


    if (stage === "Accessibility") {
      try {
        if (!eventId) {
          throw new Error("Event ID is required for accessibility settings");
        }

        const accessibilityData = form["Accessibility"];

        // Convert form data to match backend expectations
        const payload = {
          visibility: accessibilityData.eventVisibility === "Public Event" ? "public" : "private",
          wheelchairAccessible: accessibilityData.wheelchairAccess === "Yes",
          parkingAvailable: accessibilityData.parkingAvailable === "Yes",
          attendeesCoverFees: accessibilityData.transferCharges || false,
          minAge: accessibilityData.minAge ? parseInt(accessibilityData.minAge) : null,
        };
        const validateAccessibility = () => {
          let isValid = true;
          if (payload.visibility !== "public" && payload.visibility !== "private") {
            setError(stage, "eventVisibility", "Event visibility is required");
            isValid = false;
          }
          if (payload.wheelchairAccessible === undefined) {
            setError(stage, "wheelchairAccess", "Wheelchair accessibility is required");
            isValid = false;
          }
          if (payload.parkingAvailable === undefined) {
            setError(stage, "parkingAvailable", "Parking availability is required");
            isValid = false;
          }
          if (payload.minAge === null || payload.minAge === undefined || payload.minAge < 0) {
            setError(stage, "minAge", "Minimum age is required");
            isValid = false;
          }
          return isValid;
        };
        if (validateAccessibility()!== true) return;
        
        clearStageErrors(stage);
        const { isValid, errors } = validateStage(stage, formData);
if (!isValid) {
  Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
  const isValid = (window as any).validateAccessibility?.();
  if (!isValid) return;
  return;
}

        await accessibility(
          eventId,
          payload.wheelchairAccessible,
          payload.parkingAvailable,
          payload.attendeesCoverFees,
          payload.minAge?.toString() || '',
          payload.visibility as 'private' | 'public'
        );

        
      } catch (error) {
        console.error("Error updating accessibility:", error);
        errorAlert("Error", "Please fill in the form correctly.");
        setError(stage, "general", "An unexpected error occurred while updating accessibility settings.");
        return;
      }
    }

    if (stage === "Notifications") {
      const notificationData = form["Notifications"];
      const notifyOnTicketSale = notificationData.notifyOnTicketSale || false;
      await notification(eventId, notifyOnTicketSale);
    }
    // Handle other stages
    // const { isValid, errors } = validateStage(stage, formData);
    // if (!isValid) {
    //   Object.entries(errors).forEach(([field, error]) => setError(stage, field, error));
    //   return;
    // }
    // clearStageErrors(stage);
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
  <div className="flex flex-col min-h-[calc(100vh-20rem)] md:px-4 py-6">
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

      <DefaultButton onClick={goNext} isLoading={isCreatingEvent} disabled={isNextButtonDisabled || isCreatingEvent}>
        {stage === "Event Setup" && isCreatingEvent 
          ? (eventId ? "Updating Event..." : "Creating Event...") 
          : "Next"}
      </DefaultButton>
):(
  <DefaultButton variant="primary" onClick={async () => {
    if (eventId) {
      try {
        setIsCreatingEvent(true);
        await publishEvent(eventId);
        // Clear storage when publishing event (completing the flow)
        clearEventStorage();
        // Clear eventId
        Storage.removeItem("eventId");
        navigate(`/manage-events/${slug}`, { state:'Success' });
      } catch (error) {
        console.error("Error publishing event:", error);
        errorAlert("Error","Failed to publish event. Please try again.");
      } finally {
        setIsCreatingEvent(false);
      }
    }
  }} isLoading={isCreatingEvent}>
  {isCreatingEvent ? "Publishing..." : "Publish Event"}
</DefaultButton>
)}
    </div>
  </div>
</CreateEventLayout>

  )
}

export default CreateEvent