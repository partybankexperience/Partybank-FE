import { useState } from "react";
import CreateNewEvent from "./components/CreateNewEvent";
import EventCard from "../../components/cards/EventCard";
import { useNavigate } from "react-router";
import Tabs from "../../components/tabs/Tabs";

const ManageEvents = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const card = [1, 2, 3, 4];
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] bg-white rounded-md p-[1.3vw]">
      <Tabs
        tabs={["Active", "Upcoming", "Past"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="w-[50%] justify-between md:justify-evenly md:w-fit"
      />

      <div className="mt-4 flex flex-wrap gap-[20px]">
        <CreateNewEvent />
        {activeTab === "Active" && (
          <>
            {card.map((_, index) => (
              <EventCard
                key={index}
                progress={50}
                title={`Event ${index + 1}`}
                onEdit={() => {
                  // navigate to edit page
                  navigate(`/manage-events/${index}`);
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
