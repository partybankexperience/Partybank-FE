import { FaPlus } from "react-icons/fa6";
import DefaultButton from "../buttons/DefaultButton";
import avatar from "../../assets/images/avatar.png";
import logo from "../../assets/images/logoWhite.svg";
import { MdDashboard } from "react-icons/md";
import { BiSolidCalendarStar } from "react-icons/bi";
import { AiOutlineNotification } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { VscBellDot } from "react-icons/vsc";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { matchPath, useLocation, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import { useProfileSectionStore } from "../../stores/useProfileStore";
import { useState } from "react";
import { SidebarModal } from "../modal/SidebarModal";
import NotificationDropdown from "../notifications/NotificationDropdown";
import ProfileDropdown from "../dropdowns/ProfileDropdown";
import PrivateRoute from "../../utils/privateRoute";
import { Storage } from "../../stores/InAppStorage";
import { RiLogoutCircleRLine, RiSettings3Line } from "react-icons/ri";

const DashboardLayout = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { section, setSection } = useProfileSectionStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const subPageTitles: Record<string, string> = {
    "manage-events/:id": "Event Page",
    "manage-events/:id/create-ticket": "Create Ticket",
    "dashboard/create-event": "Create Event",
    "manage-series/:id": "Series Detail",
    "payout-management/settings": "Settings",
    "profile": "Profile",
  };
  

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
    {
      name: "Manage Events & Tickets",
      path: "/manage-events",
      icon: <BiSolidCalendarStar />,
    },
    { name: "Manage Series", path: "/manage-series", icon: <VscBellDot /> },
    {
      name: "Bulk Announcements",
      path: "/bulk-announcements",
      icon: <AiOutlineNotification />,
    },
    { name: "Reports", path: "/reports", icon: <TbReportAnalytics /> },
    {
      name: "Payout Management",
      path: "/payout-management",
      icon: <AiOutlineDollarCircle />,
    },
  ];
  const getPageTitle = () => {
    if (section) return section; 
    // Check subpage matches first
    for (const pattern in subPageTitles) {
      if (matchPath({ path: pattern, end: false }, currentPath)) {
        return subPageTitles[pattern];
      }
    }
  
    // Fallback to nav item name or path
    return currentNavItem?.name || "Dashboard";
  };
  
  const currentNavItem = navItems.find((item) =>
    currentPath.startsWith(item.path)
  );
  const subPath = currentPath
    .replace(currentNavItem?.path || "", "")
    .replace(/^\//, "");


  const showBackButton = subPath !== "";

  const handleLogout = () => {
    Storage.clearItem();
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/profile');
  };

  return (
    // <PrivateRoute>

    <div className="flex h-full min-h-screen w-full ">
      <ToastContainer/>
      {/* Mobile Sidebar */}
      <SidebarModal isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} title="Menu">
        <div className="space-y-4">
          {navItems.map((item, index) => {
            const isActive = currentPath.startsWith(item.path);

            return (
              <div key={index}>
                <button
                  className={`flex items-center gap-3 text-left w-full py-2 px-4 rounded ${
                    isActive ? 'text-primary font-semibold' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileNavOpen(false);
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </div>
            );
          })}
          
          {/* Settings and Logout buttons */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <button
              onClick={() => {
                handleSettings();
                setIsMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-left w-full py-2 px-4 rounded text-gray-700"
            >
              <RiSettings3Line className="text-xl" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-left w-full py-2 px-4 rounded text-red-600"
            >
              <RiLogoutCircleRLine className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </SidebarModal>
      {/* Desktop Sidebar */}
      <div className="bg-lightdark md:w-[15rem] hidden md:block md:fixed md:top-0 md:left-0 md:h-screen z-50">
        <button
          className="p-[20px] border-b border-b-[] grid m-auto cursor-pointer"
          role="button"
          aria-label="Go to dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={logo}
            alt="PartyBank Logo"
            className="md:w-[126px] m-auto "
          />
        </button>
        <nav className="flex flex-col gap-[20px] mt-[50px]">
          {navItems.map((item, index) => {
            const isActive = currentPath.startsWith(item.path);

            return (
              <div key={index} className="flex h-full">
                {isActive && (
                  <div className="w-[10px] h-full py-[30px] bg-primary rounded-r-lg" />
                )}
                <li
                  className={`flex items-center gap-[12px] font-medium text-[.9rem] cursor-pointer hover:text-primary p-[1rem] ${
                    isActive ? "text-white" : "text-[#A9ABAE]"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={`text-[1.3rem] ${
                      isActive ? "text-primary" : "text-white"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <a tabIndex={0}>{item.name}</a>
                </li>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col h-full md:ml-[15rem] w-full">
        <header className="fixed w-full md:w-[calc(100vw-15rem)] md:left-[15rem] inset-x-0 top-0  right-0 bg-white py-[25px] px-[2vw] flex justify-between items-center h-fit border-b border-[#ECECEC] z-40 ">
          <div className={`flex gap-[15px] items-center ${showBackButton ? "block" : "hidden md:block"}`}>
            {showBackButton && (
              <button
                onClick={() =>{if(section!==null)setSection(null); else navigate(-1)}}
                aria-label="Go back"
                className="text-[20px] text-black hover:text-primary"
              >
                <FaArrowLeft />
              </button>
            )}
            <h1 className="text-black block font-bold text-[1.5rem]">
            {getPageTitle()}
            </h1>
          </div>
          <button
            className="text-[35px] text-black md:hidden"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open mobile menu"
          >
            <HiOutlineBars3CenterLeft />
          </button>
          <div className={` gap-[20px] items-center ${showBackButton ? "hidden md:flex" : "flex"}`}>
            <NotificationDropdown />

            <div className="hidden md:block">
              <ProfileDropdown />
            </div>
            <DefaultButton
              size="small"
              icon={<FaPlus />}
              type="icon-left"
              variant="primary"
              className="hidden md:block"
              onClick={() => navigate("/dashboard/create-event")}
            >
              Create New Event
            </DefaultButton>
            <DefaultButton
              size="small"
              variant="primary"
              className="!px-[8px] !py-[10px] md:hidden"
              onClick={() => navigate("/dashboard/create-event")}
            >
              Create New Event
            </DefaultButton>
          </div>
        </header>
        <main className="bg-[#f8f9f9] flex-grow p-[2vw] pt-[7.5rem] md:pt-[1.5rem]  md:mt-[5rem] min-h-[90vh]">{children}</main>
      </div>
    </div>
    // </PrivateRoute>
  );
};

export default DashboardLayout;
