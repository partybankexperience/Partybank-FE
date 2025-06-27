import { useState } from "react";
import Tabs from "../../components/tabs/Tabs";
import Overview from "./components/Overview";
import Performance from "./components/Performance";
import GuestList from "./components/GuestList";
import Vendor from "./components/Vendor";
import ManageTicket from "./components/ManageTicket";

const EventPage = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  return (
    <div className="min-h-[80vh] bg-white rounded-md p-[1.3vw]">
      <Tabs
        tabs={[
          "Overview",
          // "Performance & Sales",
          // "Guest List & Complimentary Tickets",
          // "Vendor Management",
          // "Invite & Manage Ticketers",
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="  w-fit"
      />

      <div className="mt-[23px]">
      {activeTab === "Overview" && <Overview/>}
      {activeTab === "Performance & Sales" && <Performance/>}
      {activeTab === "Guest List & Complimentary Tickets" && <GuestList/>}
      {activeTab === "Vendor Management" && <Vendor/>}
      {activeTab === "Invite & Manage Ticketers" && <ManageTicket/>}
      </div>
    </div>
  );
};

export default EventPage;
