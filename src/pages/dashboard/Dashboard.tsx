import DashboardLayout from "../../components/layouts/DashboardLayout";
import Card from "./components/Card";
import { BsPeopleFill } from "react-icons/bs";
import Sales from "./components/Sales";
import Graph from "./components/Graph";
import { useState } from "react";
import Dropdown from "../../components/inputs/Dropdown";
import avatar from "../../assets/images/avatar.png";
import EventCard from "../../components/cards/EventCard";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";
const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState("Yearly");
  const [selectedSaleOption, setSelectedSaleOption] = useState("Sales");
  const navigate=useNavigate()
  const sales = [
    {
      image: "",
      name: "Brooklyn Simmons",
      price: "10,000",
      event: "Canvas and Beats",
    },
    {
      image: "",
      name: "Jane Cooper",
      price: "1,00,000",
      event: "Temple of Eros",
    },
    {
      image: "",
      name: "Cameron Williamson",
      price: "10,00,000",
      event: "Gen-Z House Backyard Party",
    },
    {
      image: "",
      name: "Robert Fox",
      price: "1,50,000",
      event: "The Outlaws Evolution",
    },
    {
      image: "",
      name: "Jacob Jones",
      price: "1,25,000",
      event: "Temple of Eros",
    },
    {
      image: "",
      name: "Annette Black",
      price: "2,00,000",
      event: "Chill With Dummzy: The Classroom",
    },
  ];
  return (
    <DashboardLayout>
      <div className="grid gap-[30px] h-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px] h-fit">
          <Card
            title="248"
            text="Total Ticket Purchase"
            icon={<BsPeopleFill className="text-[30px] text-primary" />}
          />
          <Card
            title="248"
            text="Total Ticket Purchase"
            icon={<BsPeopleFill className="text-[30px] text-primary" />}
          />
          <Card
            title="248"
            text="Total Ticket Purchase"
            icon={<BsPeopleFill className="text-[30px] text-primary" />}
          />
          <Card
            title="248"
            text="Total Ticket Purchase"
            icon={<BsPeopleFill className="text-[30px] text-primary" />}
          />
        </div>
        <div className="grid lg:grid-cols-[2.5fr_1fr] gap-[30px] ">
          <section className="bg-white rounded-md p-[1vw]" aria-label="Sales">
            <div className="flex justify-between ">
              <h2 className="text-[22px] text-black font-medium" id="Sales">
                Sales Revenue
              </h2>
              <div className="flex items-center gap-[10px]">
                <Dropdown
                  options={["Option 1", "Option 2", "Option 3"]}
                  selected={selectedSaleOption}
                  onChange={setSelectedSaleOption}
                />
                <Dropdown
                  options={["Option 1", "Option 2", "Option 3"]}
                  selected={selectedOption}
                  onChange={setSelectedOption}
                />
              </div>
            </div>

            <Graph />
          </section>
          <section
            aria-label="recentSales"
            className="bg-white rounded-md grid gap-[18px] p-[1vw] md:min-w-[400px] h-fit"
          >
            <h2 className="text-[22px] text-black font-medium" id="recentSales">
              Recent Sale
            </h2>
            <div className="grid  max-h-[300px] overflow-y-auto">
              {sales.map((sale, index) => (
                <Sales
                  key={index}
                  image={avatar}
                  name={sale.name}
                  price={sale.price}
                  event={sale.event}
                />
              ))}
            </div>
          </section>
        </div>
        <section aria-label="myEvents" className="min-h-[30vh] bg-white rounded-md p-[1vw]">
            <div className="flex justify-between">
        <h2 id='myEvents' className="text-[22px] text-black font-medium" >
        My Events
              </h2>
<button className="text-primary text-[16px] cursor-pointer hover:text-deepRed flex gap-[12.5px] items-center" onClick={()=>navigate('/manage-events')}>See all Events <IoIosArrowForward /></button>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] mt-[19px]">
                <EventCard/>
                <EventCard/>
                <EventCard/>
                <EventCard/>
              </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
