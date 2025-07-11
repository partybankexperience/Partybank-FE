import { FaPlus } from 'react-icons/fa6';
import DefaultButton from '../buttons/DefaultButton';
import logo from '../../assets/images/logoWhite.svg';
import { MdDashboard, MdFolderSpecial } from 'react-icons/md';
import { BiSolidCalendarStar } from 'react-icons/bi';
// import { AiOutlineNotification } from "react-icons/ai";
// import { TbReportAnalytics } from "react-icons/tb";
// import { AiOutlineDollarCircle } from "react-icons/ai";
import { HiOutlineBars3CenterLeft } from 'react-icons/hi2';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';
import { useProfileSectionStore } from '../../stores/useProfileStore';
import { useState } from 'react';
import { SidebarModal } from '../modal/SidebarModal';
// import NotificationDropdown from "../notifications/NotificationDropdown";
import ProfileDropdown from '../dropdowns/ProfileDropdown';
import { Storage } from '../../stores/InAppStorage';
import { RiLogoutCircleRLine } from 'react-icons/ri';
// import { RiLogoutCircleRLine, RiSettings3Line } from "react-icons/ri";
import PrivateRoute from '../../utils/privateRoute';

const DashboardLayout = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { section, setSection } = useProfileSectionStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const subPageTitles: Record<string, string> = {
    'manage-events/:slug': 'Event Page',
    'manage-events/:slug/create-ticket': 'Create Ticket',
    'dashboard/create-event': 'Create Event',
    'manage-series/:slug': 'Series Detail',
    'payout-management/settings': 'Settings',
    profile: 'Profile',
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard /> },
    {
      name: 'Manage Events & Tickets',
      path: '/manage-events',
      icon: <BiSolidCalendarStar />,
    },
    { name: 'Manage Series', path: '/manage-series', icon: <MdFolderSpecial /> },
    // {
    //   name: "Bulk Announcements",
    //   path: "/bulk-announcements",
    //   icon: <AiOutlineNotification />,
    // },
    // { name: "Reports", path: "/reports", icon: <TbReportAnalytics /> },
    // {
    //   name: "Payout Management",
    //   path: "/payout-management",
    //   icon: <AiOutlineDollarCircle />,
    // },
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
    return currentNavItem?.name || 'Dashboard';
  };

  const currentNavItem = navItems.find((item) => currentPath.startsWith(item.path));
  const subPath = currentPath.replace(currentNavItem?.path || '', '').replace(/^\//, '');

  const showBackButton = subPath !== '';

  const handleLogout = () => {
    Storage.clearItem();
    navigate('/');
  };

  // const handleSettings = () => {
  //   navigate('/profile');
  // };

  return (
    <PrivateRoute>
      <div className="flex h-full min-h-screen w-full ">
        <ToastContainer />
        {/* Mobile Sidebar */}
        <SidebarModal
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          title="Menu"
        >
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
              {/* <button
              onClick={() => {
                handleSettings();
                setIsMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-left w-full py-2 px-4 rounded text-gray-700"
            >
              <RiSettings3Line className="text-xl" />
              <span>Settings</span>
            </button> */}
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
        <div className="bg-lightdark w-[15rem] hidden md:block fixed top-0 left-0 h-screen z-50 overflow-y-auto">
          <button
            className=" grid m-auto cursor-pointer py-[1.5rem]"
            aria-label="Go to dashboard"
            onClick={() => navigate('/dashboard')}
          >
            <img src={logo} alt="PartyBank Logo" className="w-[3rem] md:w-[4rem] mx-auto" />
          </button>
          <nav className="flex flex-col gap-[.1rem] px-2">
            <ul>
              {navItems.map((item, index) => {
                const isActive = currentPath.startsWith(item.path);

                return (
                  <li key={index}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="flex h-full items-center w-full text-left"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <div className="w-[5px] h-full py-[1rem] bg-primary rounded-r-lg items-center" />
                      )}
                      <div
                        className={`flex items-center gap-[8px] md:gap-[12px] font-medium text-[.7rem] md:text-[.8rem] cursor-pointer hover:text-primary p-[0.8rem] md:p-[1rem] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isActive ? 'text-white' : 'text-[#A9ABAE]'
                        }`}
                      >
                        <div
                          className={`text-[1.1rem] md:text-[1.3rem] flex-shrink-0 ${
                            isActive ? 'text-primary' : 'text-white'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <span className="truncate">{item.name}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col h-full md:ml-[15rem] w-full max-w-full">
          <header className="fixed w-full md:w-[calc(100vw-15rem)] md:left-[15rem] inset-x-0 top-0 right-0 bg-white py-[20px] md:py-[1.2rem] px-[4vw] md:px-[2vw] flex justify-between items-center h-fit border-b border-[#ECECEC] z-40">
            <div
              className={`flex gap-[10px] md:gap-[15px] items-center min-w-0 flex-1 ${showBackButton ? 'block' : 'hidden md:block'}`}
            >
              {showBackButton && (
                <button
                  onClick={() => {
                    if (section !== null) {
                      setSection(null);
                    } else {
                      // Check if we're editing an event and should go back to manage events
                      // const eventId = Storage.getItem("eventId");
                      // if (currentPath.includes('/create-event') && eventId) {
                      //   // Clear eventId when navigating away from create event
                      //   Storage.removeItem("eventId");
                      //   navigate('/manage-events');
                      // } else {
                      //   navigate(-1);
                      // }
                      navigate(-1);
                    }
                  }}
                  aria-label="Go back"
                  className="text-[18px] md:text-[20px] text-black hover:text-primary flex-shrink-0"
                >
                  <FaArrowLeft />
                </button>
              )}
              <h1 className="text-black block font-bold text-[1.2rem] md:text-[1.2rem] truncate">
                {getPageTitle()}
              </h1>
            </div>
            <button
              className="text-[30px] md:text-[35px] text-black md:hidden flex-shrink-0"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open mobile menu"
            >
              <HiOutlineBars3CenterLeft />
            </button>
            <div
              className={`gap-[10px] md:gap-[20px] items-center flex-shrink-0 ${showBackButton ? 'hidden md:flex' : 'flex'}`}
            >
              {/* <NotificationDropdown /> */}

              <div className="hidden   lg:flex ">
                <ProfileDropdown />
              </div>
              <DefaultButton
                size="small"
                icon={<FaPlus />}
                type="icon-left"
                variant="primary"
                className="
                  px-3 sm:px-4 md:px-6
                  py-2 sm:py-2.5 md:py-3
                  text-xs sm:text-sm
                "
                onClick={() => navigate('/dashboard/create-event')}
              >
                {/* full text on md+, shorter on smaller */}
                <span className="hidden md:inline">Create New Event</span>
                <span className="inline md:hidden">Create Event</span>
              </DefaultButton>
            </div>
          </header>
          <main className="bg-[#f8f9f9] flex-grow p-[4vw] md:p-[2vw] pt-[7.5rem] md:pt-[1.5rem] md:mt-[5rem] min-h-[90vh] max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
