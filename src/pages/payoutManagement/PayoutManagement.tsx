import { BsPeopleFill } from "react-icons/bs"
import Card from "../dashboard/components/Card"
import { FaEllipsisV } from "react-icons/fa";
import { TableColumn } from "react-data-table-component";
import ReusableTable from "../../components/table/Table";
import DefaultButton from "../../components/buttons/DefaultButton";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniCurrencyDollar } from "react-icons/hi2";
import { PiCalendarCheck } from "react-icons/pi";
import { GiTimeTrap } from "react-icons/gi";
import { useNavigate } from "react-router";

const PayoutManagement = () => {
  const navigate = useNavigate();
  
  interface Guest {
    id: number;
    Email: string;
    GuestName: string;
    PhoneNumber: string;
    TicketType: string;
  }
  
  const data: Guest[] = [
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
  
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    },
    {
      id: 1,
      Email: "janecooper@gmail.com",
      GuestName: "Jane Cooper",
      PhoneNumber: "+234 806 1234567",
      TicketType: "Table for 3",
    }
    // more...
  ];
  
  const columns: TableColumn<Guest>[] = [
    { name: "Email", selector: (row) => row.Email, sortable: true },
    { name: "Guest Name", selector: (row) => row.GuestName },
    { name: "Phone Number", selector: (row) => row.PhoneNumber },
    { name: "Ticket Type", selector: (row) => row.TicketType },
    {
      name: "Actions",
      cell: () => (
        <button className="text-gray-500 hover:text-black">
          <FaEllipsisV />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "60px",
    },
  ];
  return (
    <div><div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px] h-fit">
    <Card
      title="248"
      text="Total Ticket Purchase"
      icon={<HiMiniCurrencyDollar className="text-[30px] text-primary" />}
    />
    <Card
      title="248"
      text="Total Ticket Purchase"
      icon={<BsPeopleFill className="text-[30px] text-primary" />}
    />
    <Card
      title="248"
      text="Total Ticket Purchase"
      icon={<PiCalendarCheck className="text-[30px] text-primary" />}
    />
    <Card
      title="248"
      text="Total Ticket Purchase"
      icon={<GiTimeTrap className="text-[30px] text-primary" />}
    />
  </div>
  
  <section className="bg-white p-[20px] mt-[20px] rounded-[10px]">
        {/* <CustomTable/> */}
        <div className="flex justify-between">
          <h1 className="text-black font-bold text-[1.5rem]">Payout History</h1>
          <DefaultButton type="icon-left" icon={<IoSettingsOutline className="text-[1rem]"/>} onClick={() => navigate("/payout-management/settings")}>
          Payment Setting
          </DefaultButton>
        </div>
        <ReusableTable<Guest> columns={columns} data={data} />
      </section>
  </div>
  )
}

export default PayoutManagement