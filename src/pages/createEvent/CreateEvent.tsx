import { useNavigate } from "react-router"
import { errorAlert } from "../../components/alerts/ToastService"
import DefaultButton from "../../components/buttons/DefaultButton"
import CreateEventLayout from "../../components/layouts/CreateEventLayout"
import CreateTicketComponent from "../../components/pages/CreateTicketComponent"
import { stages, useEventStore } from "../../stores/useEventStore"
import { validateStage } from "../../utils/eventValidation"
import { createEvent, createTag, getScheduleandLocation, editEvent } from "../../Containers/eventApi"
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

// const goNext = async () => {
//     const formData = form[stage] || {}

//     // Handle validation for Event Setup stage
//     if (stage === "Event Setup") {
//       // Validate required fields directly
//       const errors: Record<string, string> = {};

//       if (!formData.name || formData.name.trim() === "") {
//         errors.name = "Event Name is required";
//       }
//       if (!formData.category || formData.category.trim() === "") {
//         errors.category = "Category is required";
//       }
//       if (!formData.tags || formData.tags.trim() === "") {
//         errors.tags = "Tag is required";
//       }
//       if (!formData.contactNumber || formData.contactNumber.trim() === "") {
//         errors.contactNumber = "Contact Number is required";
//       }
//       if (!formData.description || formData.description.trim() === "") {
//         errors.description = "Event Description is required";
//       }

//       console.log(errors, 'errors in event setup')
//       // Set errors if any exist
//       if (Object.keys(errors).length > 0) {
//         Object.entries(errors).forEach(([field, error]) => {
//           setError(stage, field, error);
//         });

//         // Trigger validation in EventSetup component to show errors
//         const validationFn = (window as any).validateEventSetup;
//         if (typeof validationFn === 'function') {
//           validationFn();
//         }
//         return;
//       }

//       // Clear errors if validation passes
//       clearStageErrors(stage);

//       // Set loading state only when making API call
//       setIsCreatingEvent(true);

//       // Create the event if validation passes
//       const success = await handleCreateEvent(formData);
//       console.log(success, 'success in event creation')
//       if (!success) {
//         setIsCreatingEvent(true);
//         return; // Stop if event creation fails
//       }

//       // Move to next stage after successful event creation
//       if (currentIndex < stages.length - 1) {
//         setStage(stages[currentIndex + 1]);
//       }
//       return; // Important: return here to prevent further execution
//     } else {
//       // For other stages, use the validation rules
//       const { isValid, errors } = validateStage(stage, formData)

//       if (!isValid) {
//         // Set errors for the current stage
//         Object.entries(errors).forEach(([field, error]) => {
//           setError(stage, field, error)
//         })
//         return
//       }

//       // Clear errors if validation passes
//       clearStageErrors(stage)
//     }

//     // Stage advancement for other stages (not Event Setup)
//     if (currentIndex < stages.length - 1) {
//       setStage(stages[currentIndex + 1])
//     }
//   }
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
          formData.endDate, 
          formData.startTime, 
          formData.endTime, 
          !formData.showLocation, // isLocationTBA - boolean
          formData.venueName, 
          formData.address
        );
        console.log(res, 'Schedule & Location response');
      } catch (error) {
        console.error("Error in Schedule & Location stage:", error);
        setError(stage, "general", "An unexpected error occurred. Please try again.");
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
      {currentIndex > 0 && (
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