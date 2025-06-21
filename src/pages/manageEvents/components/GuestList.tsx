import { useState } from "react";
import DefaultButton from "../../../components/buttons/DefaultButton";
import DefaultInput from "../../../components/inputs/DefaultInput";
import { CiSearch } from "react-icons/ci";
import { TableColumn } from "react-data-table-component";
import { FaEllipsisV } from "react-icons/fa";
import ReusableTable from "../../../components/table/Table";

const GuestList = () => {
  const [search, setsearch] = useState("");

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
    <div className="">
      <div className="flex justify-between">
        <h1 className="text-black font-bold text-[1.4rem] hidden md:block">
          Guest List & Complimentary Tickets
        </h1>
        <div className="flex items-center justify-between md:justify-normal gap-2 ">
          <div
            className="w-fit"
          >
            <DefaultInput
              id="search"
              label=""
              value={search}
              setValue={setsearch}
              leftContent={<CiSearch className="text-[20px] text-black" />}
              placeholder="Search guest.."
              classname="md:!w-[13rem] min-w-[13rem]"
            />
          </div>
          <DefaultButton variant="primary" className="!w-fit  whitespace-nowrap">
            Invite Guest
          </DefaultButton>
        </div>
      </div>
      <section>
        {/* <CustomTable/> */}
        <ReusableTable<Guest> columns={columns} data={data} />
      </section>
    </div>
  );
};

export default GuestList;
