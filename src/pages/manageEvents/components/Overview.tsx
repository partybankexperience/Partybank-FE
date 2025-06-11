import ticket from "../../../assets/images/ticket.svg";
import DefaultButton from "../../../components/buttons/DefaultButton";
import { LuPencilLine } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { RiInboxArchiveLine } from "react-icons/ri";
import { FaShare } from "react-icons/fa";
import TicketsCard from "../../../components/cards/TicketCard";
import { useNavigate, useParams, useLocation } from "react-router";
import { getEventsById } from "../../../Containers/eventApi";
import { useEffect, useState } from "react";
import { formatDate, formatTimeRange } from "../../../components/helpers/dateTimeHelpers";
import { useEventStore } from "../../../stores/useEventStore";
import { Storage } from "../../../stores/InAppStorage";

const Overview = () => {
  const navigate=useNavigate()
  const {slug}=useParams()
  const location = useLocation();
  const [eventData, setEventData] = useState<any>(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const { setStage, prefillEventData, mapBackendStepToFrontend } = useEventStore();
  
  // Get ID from navigate state
  const eventId = location.state?.id;
  // const location = [
  //   { icon: <GrLocation className="text-primary" />, name: "Landmark Centre" },
  //   {
  //     icon: <MdOutlineCalendarMonth className="text-primary" />,
  //     name: "12 Apr 2025",
  //   },
  //   {
  //     icon: <FaRegClock className="text-primary" />,
  //     name: "8:15 AM - 08:30 PM",
  //   },
  // ];

  // Format location data using actual event data or fallbacks
  const getLocationData = () => {
    if (!eventData) return [];

    return [
      { 
        icon: <GrLocation className="text-primary" />, 
        name: eventData.venueName || eventData.location || "Location TBD" 
      },
      {
        icon: <MdOutlineCalendarMonth className="text-primary" />,
        name: eventData.startDate ? formatDate(eventData.startDate) : "Date TBD",
      },
      {
        icon: <FaRegClock className="text-primary" />,
        name: eventData.startTime ? formatTimeRange(eventData.startTime, eventData.endTime) : "Time TBD",
      },
    ];
  };

  const getEventDetails = () => {
    if (!eventData) return [];

    return [
      { label: "Category", value: eventData.category || "N/A" },
      { label: "Tags", value: Array.isArray(eventData.tags) ? eventData.tags.join(", ") : (eventData.tags || "N/A") },
      { label: "Series", value: eventData.seriesName || "N/A" },
      { label: "Status", value: eventData.status || "N/A" },
      { label: "Visibility", value: eventData.visibility || "N/A" },
    ];
  };

  const getScheduleLocationDetails = () => {
    if (!eventData) return [];

    return [
      { label: "Start Date", value: eventData.startDate ? formatDate(eventData.startDate) : "N/A" },
      { label: "End Date", value: eventData.endDate ? formatDate(eventData.endDate) : "N/A" },
      { label: "Start Time", value: eventData.startTime || "N/A" },
      { label: "End Time", value: eventData.endTime || "N/A" },
      { label: "Venue", value: eventData.venueName || eventData.location || "N/A" },
    ];
  };

  const getAccessibilityDetails = () => {
    if (!eventData) return [];

    return [
      { label: "Min Age", value: eventData.minAge ? `${eventData.minAge} years` : "No restriction" },
      { label: "Wheelchair Accessible", value: eventData.wheelchairAccessible ? "Yes" : "No" },
      { label: "Parking Available", value: eventData.parkingAvailable ? "Yes" : "No" },
      { label: "Attendees Cover Fees", value: eventData.attendeesCoverFees ? "Yes" : "No" },
    ];
  };

  const handleShare = async () => {
    if (!eventData) return;

    setShareLoading(true);
    
    try {
      // Create the event URL (you can modify this based on your event public URL structure)
      const eventUrl = `${window.location.origin}/event/${eventData.slug || eventData.id}`;
      
      // Try to use the Web Share API first (for mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: eventData.name,
          text: `Check out this event: ${eventData.name}`,
          url: eventUrl,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(eventUrl);
        
        // You can add a toast notification here
        console.log('Event URL copied to clipboard!');
        
        // Optional: Show a temporary feedback
        const shareButton = document.querySelector('[data-share-button]');
        const originalText = shareButton?.textContent ?? "";
        if (shareButton) {
          shareButton.textContent = 'Copied!';
          setTimeout(() => {
            shareButton.textContent = originalText;
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: just copy the URL
      try {
        const eventUrl = `${window.location.origin}/event/${eventData.slug || eventData.id}`;
        await navigator.clipboard.writeText(eventUrl);
        console.log('Event URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    } finally {
      setShareLoading(false);
    }
  };
  const buttonOptions = [
    {
      name: "Edit",
      // onClick: () => (onEdit ? onEdit() : navigate("/manage-events/:id")),
      icon: <LuPencilLine />,
    },
    {
      name: "Duplicate",
      // onClick: () => onDuplicate?.(),
      icon: <FiCopy />,
    },
    {
      name: "Delete",
      // onClick: () => onDelete?.(),
      icon: <AiOutlineDelete />,
    },
    {
      name: "Archive",
      // onClick: () => onDelete?.(),
      icon: <RiInboxArchiveLine />,
    },
  ];
  // const eventDetails = [
  //   { label: "Internal ID", value: "1236548765" },
  //   { label: "Category", value: "Festival" },
  //   { label: "Tags", value: "Beats, Dj, Party" },
  //   { label: "Series", value: "My Series" },
  //   { label: "Organizer’s Contact Number", value: "+234  704 3946 3386" },
  // ];

  useEffect(() => {
    let isMounted = true;

    async function getEvent() {
      try {
        setLoading(true);
        const res = await getEventsById(eventId as string);

        if (!isMounted) return;

        setEventData(res);

        if (res.currentStep !== "reviewPublish") {
          // Store the event ID for editing
          Storage.setItem("eventId", res.id);

          // Prefill form data using the store method
          prefillEventData(res);

          // Map backend step to frontend stage and set it
          const frontendStage = mapBackendStepToFrontend(res.currentStep);
          setStage(frontendStage);

          // Navigate to create event page
          navigate('/dashboard/create-event');
          return;
        }

        // Extract tickets from the response
        if (res && res.tickets && Array.isArray(res.tickets)) {
          setTickets(res.tickets);
        } else if (res && res.data && res.data.tickets && Array.isArray(res.data.tickets)) {
          setTickets(res.data.tickets);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (eventId) {
      getEvent();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId])

  if (loading) {
    return (
      <div className="grid">
        <h1 className="text-black text-[1.6rem] font-medium">Overview</h1>
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="grid">
        <h1 className="text-black text-[1.6rem] font-medium">Overview</h1>
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">Event not found</p>
        </div>
      </div>
    );
  }

  const locationData = getLocationData();
  const eventDetails = getEventDetails();
  const scheduleLocationDetails = getScheduleLocationDetails();
  const accessibilityDetails = getAccessibilityDetails();

  return (
    <div className="grid">
      <h1 className="text-black text-[1.6rem] font-medium">Overview</h1>
      <div className="grid md:grid-cols-[1fr_2fr] gap-[30px] mt-[20px]">
        <div className="rounded-[10px] h-[170px] md:h-[350px] ">
          <img
            src={eventData.bannerImage || ticket}
            alt={`${eventData.name || 'Event'} banner`}
            className="rounded-[10px]  h-[170px] md:h-[350px] w-full object-cover overflow-hidden"
          />
        </div>
        <div className="grid gap-[20px] h-fit">
          <div className="pb-[20px] grid gap-[20px] border-b border-b-[#EDEDED]">
            <div className="flex items-center justify-between h-fit">
              <h2 className="text-[1.3rem] font-bold">{eventData.name || "Untitled Event"}</h2>
              <div className="flex gap-2">
                <DefaultButton
                  variant="tertiary"
                  type="icon-left"
                  className="!w-fit border"
                  icon={<FaShare className="text-primary" />}
                  onClick={handleShare}
                  isLoading={shareLoading}
                >
                  <span data-share-button>Share</span>
                </DefaultButton>
                <DefaultButton
                  variant="tertiary"
                  type="icon-left"
                  className="!w-fit border"
                  icon={<LuPencilLine className="text-primary" />}
                >
                  Edit
                </DefaultButton>
              </div>
            </div>
            <p className="text-lightGrey text-[1rem]">
              {eventData.description || "No description available"}
            </p>
            <div className="flex flex-col md:flex-row gap-[16px] text-[1rem]">
              {locationData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-black "
                >
                  {item.icon}
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-[20px] grid gap-[20px] border-b border-b-[#EDEDED]">
            <div className="flex items-center justify-between h-fit">
              <h3 className="text-[1.3rem] ">Tickets</h3>
              <DefaultButton
                variant="tertiary"
                type="icon-left"
                className="!w-fit border"
                icon={<FaPlus className="text-primary" />}
                onClick={() => {navigate(`/manage-events/${slug}/create-ticket`, { state: { id: eventId } })}}
              >
                Create Ticket
              </DefaultButton>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3  gap-[20px] ">
              {tickets.length > 0 ? (
                tickets.map((ticket: any, index: number) => (
                  <TicketsCard
                    key={ticket.id || index}
                    title={ticket.name || "Unnamed Ticket"}
                    availability={ticket.isSoldOut ? "Sold Out" : ticket.stock > 0 ? "Available" : "Limited"}
                    capacity={ticket.stock?.toString() || "N/A"}
                    price={ticket.type === "free" ? "Free" : `₦${ticket.price?.toLocaleString() || "0"}`}
                    buttonOptions={buttonOptions}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <p>No tickets found for this event.</p>
                  <p className="text-sm mt-2">Create your first ticket to get started.</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-[1.25rem] border border-[#EDEDED] rounded-lg">
            <h5 className="text-[1.25rem] font-bold text-black mb-[1rem]">
              Event Setup:
            </h5>
            <div>
              {eventDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between text-[1rem] ${
                    idx !== eventDetails.length - 1 ? "mb-[0.75rem]" : ""
                  }`}
                >
                  <p className="text-[#979595]">{item.label}:</p>
                  <p className="text-black">{item.value}</p>
                </div>
              ))}
            </div>
            <h5 className="text-[1.25rem] font-bold text-black mt-[25px] mb-[1rem]">
            Schedule & Location :
            </h5>
            <div>
              {scheduleLocationDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between text-[1rem] ${
                    idx !== scheduleLocationDetails.length - 1 ? "mb-[0.75rem]" : ""
                  }`}
                >
                  <p className="text-[#979595]">{item.label}:</p>
                  <p className="text-black">{item.value}</p>
                </div>
              ))}
            </div>
            <h5 className="text-[1.25rem] font-bold text-black mt-[25px] mb-[1rem]">
            Accessibility :
            </h5>
            <div>
              {accessibilityDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between text-[1rem] ${
                    idx !== accessibilityDetails.length - 1 ? "mb-[0.75rem]" : ""
                  }`}
                >
                  <p className="text-[#979595]">{item.label}:</p>
                  <p className="text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
// The Overview component was updated to fetch event data and display it with proper formatting using helper functions.