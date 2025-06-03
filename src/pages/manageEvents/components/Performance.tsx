import Sales from "../../dashboard/components/Sales";
import PerformanceChart from "./PerformanceGraph";
import avatar from "../../../assets/images/avatar.png";
import { useState } from "react";
import Dropdown from "../../../components/inputs/Dropdown";
import PerformancePieChart from "./PerformancePieChart";
import { IoIosPeople } from "react-icons/io";
import { BsPersonCheckFill } from "react-icons/bs";
import { TbClockHour6 } from "react-icons/tb";
import { TbRefresh } from "react-icons/tb";
import TimeBarChart from "./TimeChart";

const Performance = () => {
  const [selectedOption, setSelectedOption] = useState("Weekly");
  // const [selectedSaleOption, setSelectedSaleOption] = useState("Sales");
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
  const stats = [
    {
      icon: <IoIosPeople className="w-6 h-6 text-primary" />,
      value: "1,235",
      label: "Total Unique Attendees",
    },
    {
      icon: <BsPersonCheckFill className="w-6 h-6 text-primary" />,
      value: "624",
      label: "Checked-in Attendees",
    },
    {
      icon: <TbClockHour6 className="w-6 h-6 text-primary" />,
      value: "1,235",
      label: "First-Time Attendees",
    },
    {
      icon: <TbRefresh className="w-6 h-6 text-primary" />,
      value: "1,235",
      label: "Returning Attendees",
    },
  ];
  const rows = [
    { label: "Gross Revenue", value: "₦32,85,000" },
    { label: "Less:", value: "", isLabelBold: true },
    { label: "Partybank Fees", value: "₦20,000" },
    { label: "Processor Fees", value: "₦1,000", hasBorder: true },
  ];
  return (
    <div className="grid gap-[20px]">
      <div className="flex items-center justify-between">
        <h1 className="text-black font-bold text-[1.625rem] mb-[25px]">
          Performance & Sales
        </h1>
      </div>
      <div className="grid gap-[20px] md:grid-cols-2 md:auto-rows-auto lg:grid-cols-[2fr_1fr_1fr]">
        <section
          className="bg-white rounded-md p-[2vw] md:p-[1vw] border border-[#E1E1E1] md:col-span-2 lg:col-span-1"
          aria-label="Sales"
        >
          <div className="flex justify-between ">
            <h2 className="text-[22px] text-black font-medium" id="Sales">
              Sales Revenue
            </h2>
            <div className="flex items-center gap-[10px]">
              <Dropdown
                options={["Option 1", "Option 2", "Option 3"]}
                selected={selectedOption}
                onChange={setSelectedOption}
              />
            </div>
          </div>
          <PerformanceChart />
        </section>
        <section
          aria-label="ticketSales"
          className="bg-white rounded-md grid gap-[18px] border border-[#E1E1E1] p-[2vw] md:p-[1vw] "
        >
          <h2 className="text-[22px] text-black font-medium" id="ticketSales">
            Ticket Sales
          </h2>
          <PerformancePieChart />
        </section>
        <section
          aria-label="recentSales"
          className="bg-white rounded-md grid gap-[18px] border border-[#E1E1E1] p-[2vw] md:p-[1vw] "
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
      <div className="grid gap-[20px] h-fit md:grid-cols-2 md:auto-rows-auto lg:grid-cols-[4fr_2.5fr_2fr]">
        <section
          className="bg-white rounded-md  p-[2vw] md:p-[1vw] border border-[#E1E1E1] col-span-1"
          aria-label="Attendees"
        >
          <div className="flex justify-between ">
            <h2 className="text-[22px] text-black font-medium" id="Attendees">
              Attendee Breakdown
            </h2>
            <div className="flex items-center gap-[10px]">
              <Dropdown
                options={["Option 1", "Option 2", "Option 3"]}
                selected={selectedOption}
                onChange={setSelectedOption}
              />
              <Dropdown
                options={["Option 1", "Option 2", "Option 3"]}
                selected={selectedOption}
                onChange={setSelectedOption}
              />
            </div>
          </div>
          <div className="grid gap-[20px] grid-cols-2 ">
            {stats.map(({ icon, value, label }, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center items-start gap-[18px] mt-[25px]"
              >
                <div className="p-[13px] gap-[10px] rounded-[8px] bg-[#fce4e8] flex items-center justify-center w-fit">
                  {icon}
                </div>
                <div className="grid gap-[5px]">
                  <p className="text-black text-[1.2rem]">{value}</p>
                  <h3 className="text-[.8rem] text-[#918F90]">{label}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          className="bg-white rounded-md  p-[2vw] md:p-[1vw] border border-[#E1E1E1]  md:col-span-2 lg:col-span-1"
          aria-label="salesTime"
        >
          <div className="flex justify-between ">
            <h2 className="text-[22px] text-black font-medium" id="salesTime">
              Most Sales Times
            </h2>
            <div className="flex items-center gap-[10px]">
              <Dropdown
                options={["Option 1", "Option 2", "Option 3"]}
                selected={selectedOption}
                onChange={setSelectedOption}
              />
            </div>
          </div>
          <TimeBarChart />
        </section>
        <section
          className="bg-white rounded-md border border-[#E1E1E1] grid p-[2vw] md:p-[1vw] md:col-span-2 lg:col-span-1"
          aria-label="revenue"
        >
          <h2
            className="text-[1.375rem] text-black font-medium mb-[1rem]"
            id="revenue"
          >
            Net Revenue
          </h2>

          {rows.map(({ label, value, isLabelBold, hasBorder }, idx) => (
            <div
              key={idx}
              className={[
                "flex justify-between items-center ",
                hasBorder ? "border-b border-[#EDEDED] pb-[0.625rem]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <p
                className={[
                  "text-[0.8rem]",
                  isLabelBold ? "text-black font-bold" : "text-[#979595]",
                ].join(" ")}
              >
                {label}
              </p>
              {value && <p className="text-black text-[1rem]">{value}</p>}
            </div>
          ))}

          <div className="mt-[0.5rem] pt-[0.625rem] flex justify-between text-[1rem]">
            <p>
              Total
              <br />
              <span className="text-[#979595] text-[0.7rem]">
                (Net Revenue)
              </span>
            </p>
            <p className="text-black font-bold">₦32,64,000</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Performance;
