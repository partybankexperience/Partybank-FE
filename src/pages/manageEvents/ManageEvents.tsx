
import { useEffect, useState } from "react";
import CreateNewEvent from "./components/CreateNewEvent";
import EventCard from "../../components/cards/EventCard";
import { useNavigate } from "react-router";
import Tabs from "../../components/tabs/Tabs";
import { getEvents } from "../../Containers/eventApi";
import { EventCardSkeleton } from "../../components/common/LoadingSkeleton";

const ManageEvents = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getAllEvent() {
    try {
      setLoading(true);
      const res = await getEvents();
      console.log(res);
      setEvents(res || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllEvent();
  }, []);

  // Filter events based on status
  const getFilteredEvents = () => {
    if (!events || events.length === 0) return [];

    switch (activeTab) {
      case "Active":
        return events.filter((event: any) => event.status === "published");
      case "Upcoming":
        return events.filter((event: any) => event.status === "upcoming");
      case "Past":
        return events.filter((event: any) => event.status === "past");
      case "Drafts":
        return events.filter((event: any) => event.status === "draft");
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-[80vh] bg-white rounded-md p-[1.3vw]">
      <Tabs
        tabs={["Active", "Upcoming", "Past", "Drafts"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="w-[50%] justify-between md:justify-evenly md:w-fit"
      />

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <CreateNewEvent />
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((val: any, index) => (
            <EventCard
              key={val.id || index}
              progress={50}
              name={val?.name}
              startTime={val?.startTime}
              endTime={val?.endTime}
              startDate={val?.startDate}
              location={val?.location}
              bannerImage={val?.bannerImage}
              onEdit={() => {
                navigate(`/manage-events/${val.id}`, { state: { event: val } });
              }}
              onDuplicate={() => console.log("Duplicate clicked")}
              onDelete={() => console.log("Delete clicked")}
            />
          ))
        ) : (
          <div className="m-auto text-center text-gray-500 py-8">
            No {activeTab.toLowerCase()} events found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
