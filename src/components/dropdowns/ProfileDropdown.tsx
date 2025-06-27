
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from 'react-icons/ri';
// import { RiLogoutCircleRLine, RiSettings3Line } from 'react-icons/ri';
// import avatar from '../../assets/images/avatar.png';
import { BsPersonCircle } from "react-icons/bs";
import { Storage } from '../../stores/InAppStorage';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Storage.clearItem();
    navigate('/');
    setIsOpen(false);
  };

  // const handleSettings = () => {
  //   navigate('/profile');
  //   setIsOpen(false);
  // };

  return (
    <div className="relative  flex items-center" ref={dropdownRef}>
      <button 
        className="w-[2.4rem] h-[2.4rem] rounded-full cursor-pointer bg-gray-100 " 
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* <img
          src={avatar}
          alt="profile picture"
          className="w-full h-full rounded-full object-cover"
        /> */}
        <BsPersonCircle className='w-full h-full rounded-full object-cover text-gray-300'/>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[6rem] w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* <button
              onClick={handleSettings}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RiSettings3Line className="text-lg" />
              <span>Settings</span>
            </button> */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              <RiLogoutCircleRLine className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
