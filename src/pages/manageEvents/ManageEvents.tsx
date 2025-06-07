import { useEffect, useState } from "react";
import CreateNewEvent from "./components/CreateNewEvent";
import EventCard from "../../components/cards/EventCard";
import { useNavigate } from "react-router";
import Tabs from "../../components/tabs/Tabs";
import { getEvents } from "../../Containers/eventApi";

const ManageEvents = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const card = [1, 2, 3, 4];
  const navigate = useNavigate();
  const [events, setevents] = useState([])

  async function getAllEvent() {
    try {
      const res=await getEvents()
      console.log(res)
      setevents(res)
    } catch (error) {
      console.error("Error fetching events:", error);
      
    }
  }
  useEffect(() => {
    getAllEvent();
  }, [])
  
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
        {activeTab === "Active" && (
          <>
            {events.map((val:any, index) => (
              <EventCard
                key={index}
                progress={50}
                title={val?.name}
                time={val?.startTime}
                date={val?.startDate}
                location={val?.location}
                image={val?.bannerImage}
                onEdit={() => {
                  // navigate to edit page
                  navigate(`/manage-events/${val.id}`,{state: { event: val }});
                }}
                onDuplicate={() => console.log("Duplicate clicked")}
                onDelete={() => console.log("Delete clicked")}
              />
            ))}
          </>
        )}
        {activeTab === "Upcoming" && <p>Showing Upcoming Events</p>}
        {activeTab === "Past" && <p>Showing Past Events</p>}
      </div>
    </div>
  );
};

export default ManageEvents;
