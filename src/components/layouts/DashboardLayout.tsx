import { VscBellDot } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa6";
import DefaultButton from "../buttons/DefaultButton";
import avatar from "../../assets/images/avatar.png";
import logo from "../../assets/images/logoWhite.svg";
import { MdDashboard } from "react-icons/md";
import { BiSolidCalendarStar } from "react-icons/bi";
import { AiOutlineNotification } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router";

const DashboardLayout = ({children}:any) => {
    const navigate = useNavigate();
  const location = useLocation();
    const currentPath = location.pathname;
    const navItems=[{name:"Dashboard", path:"/dashboard",icon:<MdDashboard />},
    {name:"Manage Events & Tickets", path:"/manage-events",icon:<BiSolidCalendarStar />},
    {name:"Manage Series", path:"/manage-series",icon:<VscBellDot />},
    {name:"Bulk Announcements", path:"/bulk-announcements",icon:<AiOutlineNotification />},
    {name:"Reports", path:"/reports",icon:<TbReportAnalytics />},
    {name:"Payout Management", path:"/payout-management",icon:<AiOutlineDollarCircle />}]
  return (
    <div className="grid grid-cols-[1fr_5fr] min-h-screen">
        <div className="bg-lightdark md:min-w-[300px]">
            <button className="p-[20px] border-b border-b-[] grid m-auto" role="button" aria-label="Go to dashboard">
                <img src={logo} alt="PartyBank Logo" className="md:w-[126px] m-auto "/>
            </button>
            <nav className="flex flex-col gap-[20px] mt-[50px]">
                {navItems.map((item, index) => (    
                    <ul className="flex h-full ">
                    {currentPath === item.path &&
                        <div className={`w-[10px] h-[100%] py-[30px] bg-primary rounded-r-lg`}>
                            <p className="text-primary " aria-hidden></p>
                        </div>
                    }
                    <li key={index} className={`flex items-center gap-[12px] text-white font-medium text-[18px] cursor-pointer hover:text-primary p-[18px]`} onClick={()=>navigate(item.path)} >
                        <div className={`text-[26px] ${currentPath === item.path ?'text-primary':'text-white'}`}>
                        {item.icon}
                        </div>
                        <a tabIndex={0}>{item.name}</a>
                    </li>
                    </ul>
                ))}
            </nav>
        </div>
        <div className="flex flex-col h-full">
            <header className="bg-white py-[25px] px-[2vw] flex justify-between items-center h-fit border-b border-[#ECECEC]">
<h1 className="text-black font-bold text-[26px]">Dashboard</h1>
<div className="flex gap-[20px] items-center">
    <button aria-description="Notifications" className="w-[50px] h-[50px] rounded-full border border-[#DEDEDE] flex justify-center items-center">
    <VscBellDot className="text-[26px]"/>
    </button>
    <div className="w-[50px] h-[50px] rounded-full">
        <img src={avatar} alt="profile picture" className="w-full rounded-full" />
    </div>
    <DefaultButton icon={<FaPlus />} type="icon-left" variant="primary" className="">
        Create New Event
    </DefaultButton>
</div>
            </header>
            <main className="bg-[#f8f9f9] flex-grow">

        {children}
            </main>
        </div>
        </div>
  )
}

export default DashboardLayout