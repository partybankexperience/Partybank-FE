import { useNavigate } from "react-router"
import { errorAlert } from "../../components/alerts/ToastService"
import DefaultButton from "../../components/buttons/DefaultButton"
import CreateEventLayout from "../../components/layouts/CreateEventLayout"
import CreateTicketComponent from "../../components/pages/CreateTicketComponent"
import { stages, useEventStore } from "../../stores/useEventStore"
import { validateStage } from "../../utils/eventValidation"
import { createEvent } from "../../Containers/eventApi"
import Accessibility from "./Accessibility"
import EventSetup from "./EventSetup"
import Guest from "./Guest"
import Notification from "./Notification"
import Review from "./Review"
import ScheduleEvent from "./ScheduleEvent"
import { useState, useEffect } from "react";


const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const { stage, setStage, form, errors, setError, clearStageErrors, clearEventStorage, setFormValue } = useEventStore()
    const currentIndex = stages.indexOf(stage)
    const navigate = useNavigate()

  const handleCreateEvent = async (eventSetupData: any) => {
    try {
      setIsCreatingEvent(true);

      const response = await createEvent(
        eventSetupData.name,
        eventSetupData.description,
        eventSetupData.coverImage || "",
        [eventSetupData.tags],
        eventSetupData.contactNumber,
        eventSetupData.category,
        eventSetupData.seriesId || undefined
      );

      // Store the created event ID for later use
      setFormValue("Event Setup", "eventId", response.id);

      console.log("Event created successfully:", response);

      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      errorAlert("Error", "Failed to create event. Please try again.");
      return false;
    } finally {
      setIsCreatingEvent(false);
    }
  };

const goNext = async () => {
    const formData = form[stage] || {}

    // Handle validation for Event Setup stage
    if (stage === "Event Setup") {
      // Validate required fields directly
      const errors: Record<string, string> = {};

      if (!formData.name || formData.name.trim() === "") {
        errors.name = "Event Name is required";
      }
      if (!formData.category || formData.category.trim() === "") {
        errors.category = "Category is required";
      }
      if (!formData.tags || formData.tags.trim() === "") {
        errors.tags = "Tag is required";
      }
      if (!formData.contactNumber || formData.contactNumber.trim() === "") {
        errors.contactNumber = "Contact Number is required";
      }
      if (!formData.description || formData.description.trim() === "") {
        errors.description = "Event Description is required";
      }

      // Set errors if any exist
      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, error]) => {
          setError(stage, field, error);
        });

        // Trigger validation in EventSetup component to show errors
        const validationFn = (window as any).validateEventSetup;
        if (typeof validationFn === 'function') {
          validationFn();
        }
        return;
      }

      // Clear errors if validation passes
      clearStageErrors(stage);

      // Set loading state only when making API call
      setIsCreatingEvent(true);

      // Create the event if validation passes
      const success = await handleCreateEvent(formData);
      if (!success) {
        return; // Stop if event creation fails
      }
      
      // Move to next stage after successful event creation
      if (currentIndex < stages.length - 1) {
        setStage(stages[currentIndex + 1]);
      }
      return; // Important: return here to prevent further execution
    } else {
      // For other stages, use the validation rules
      const { isValid, errors } = validateStage(stage, formData)

      if (!isValid) {
        // Set errors for the current stage
        Object.entries(errors).forEach(([field, error]) => {
          setError(stage, field, error)
        })
        return
      }

      // Clear errors if validation passes
      clearStageErrors(stage)
    }

    // Stage advancement for other stages (not Event Setup)
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1])
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setStage(stages[currentIndex - 1])
    }
  }

    useEffect(() => {
    // Clear event storage when component unmounts (user leaves the page)
    return () => {
      clearEventStorage();
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
        {stage === "Event Setup" && isCreatingEvent ? "Creating Event..." : "Next"}
      </DefaultButton>
):(
  <DefaultButton variant="primary" onClick={() => navigate("/dashboard")}>
  Publish Event
</DefaultButton>
)}
    </div>
  </div>
</CreateEventLayout>

  )
}

export default CreateEvent