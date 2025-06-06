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
    const { isValid, errors: validationErrors } = validateStage(stage, formData)

    if (!isValid) {
      // Clear existing errors first
      clearStageErrors(stage)

      // Set new errors
      Object.entries(validationErrors).forEach(([field, error]) => {
        setError(stage, field, error)
      })

      // Focus on first error field
      const firstErrorField = Object.keys(validationErrors)[0]
      setTimeout(() => {
        const errorElement = document.getElementById(firstErrorField)
        if (errorElement) {
          errorElement.focus()
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)

      errorAlert("Missing Required Fields", "Please fill out all required fields to continue.")
      return
    }

    // Clear errors if validation passes
    clearStageErrors(stage)

    // If we're on Event Setup stage, create the event first
    if (stage === "Event Setup") {
      const eventCreated = await handleCreateEvent(formData);
      if (!eventCreated) {
        return; // Don't proceed if event creation failed
      }
    }

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