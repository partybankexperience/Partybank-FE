import { RiLogoutCircleRLine, RiDeleteBin5Line } from "react-icons/ri";
import SlideToggle from "../../components/inputs/SlideToggle";
import { IoCameraOutline } from "react-icons/io5";
import DefaultButton from "../../components/buttons/DefaultButton";
import { LuPencilLine } from "react-icons/lu";
import DefaultInput from "../../components/inputs/DefaultInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Storage } from "../../stores/InAppStorage";

interface InfoItem {
  name: string;
  value: string;
}

interface ProfileSectionProps {
  section: string;
  personalInfo: InfoItem[];
  preferenceInfo: InfoItem[];
  securityInfo: InfoItem[];
  organizationInfo: InfoItem[];
  toggle: boolean;
  setToggle: (val: boolean) => void;
  onBack: () => void;
}

const ProfileSection = ({
  section,
  personalInfo,
  preferenceInfo,
  securityInfo,
  organizationInfo,
  toggle,
  setToggle,
  onBack,
}: ProfileSectionProps) => {
    const [profilePic, setProfilePic] = useState<string>("");
    const [name, setname] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
      Storage.clearItem();
      navigate('/login');
    };
  if (section === "Personal Information") {
    return (
      <div className="flex flex-col gap-4 pt-[16px] bg-white px-[20px] h-[85vh] ">
        <div className="grid grid-cols-3">
          <div className="w-[6rem] h-[6rem] rounded-full relative bg-grey col-start-2">
            <img src="" alt="profilePic" />
            <div className="absolute h-[36px] w-[36px] rounded-full bg-primary bottom-0 right-[-.5rem] grid justify-center items-center border-[2px] border-white">
              <IoCameraOutline className="text-white text-[1.2rem] " />
            </div>
          </div>
          <div className=" grid justify-end ">
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border !px-[10px] !py-[10px] "
          >
            Edit
          </DefaultButton>

          </div>
        </div>
        {/* <h1 className="text-lg font-semibold">{section}</h1> */}
        <div className="grid w-full gap-[15px] ">
            <DefaultInput id='fullName' value={name} setValue={setname} classname="w-full" label='Full Name' placeholder="Jane Cooper"/>
            <DefaultInput id='email' value={name} setValue={setname} classname="w-full" label='Email Address' placeholder="janecooper@gmail.com"/>
            <DefaultInput id='phone' value={name} setValue={setname} classname="w-full" label='Phone Number' placeholder="+234-803-12345678"/>
        </div>
        {/* {personalInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))} */}
      </div>
    );
  }

  if (section === "Organization Details") {
    return (
      <div className="flex flex-col gap-4 pt-[16px] bg-white px-[20px] h-[85vh]">
        <div className="grid grid-cols-3">
        <div className="w-[6rem] h-[6rem] rounded-full relative bg-grey col-start-2">
            <img src="" alt="profilePic" />
            <div className="absolute h-[36px] w-[36px] rounded-full bg-primary bottom-0 right-[-.5rem] grid justify-center items-center border-[2px] border-white">
              <IoCameraOutline className="text-white text-[1.2rem] " />
            </div>
          </div>
          <div className=" grid justify-end ">
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border !px-[10px] !py-[10px] "
          >
            Edit
          </DefaultButton>

          </div>
        </div>
        {/* <h1 className="text-lg font-semibold">{section}</h1> */}
        <div className="flex flex-col w-full gap-[15px] pt-[16px] ">
            <DefaultInput id='organizerName' value={name} setValue={setname} classname="w-full" label='Business / Organizer Name' placeholder="Jane Cooper"/>
            <DefaultInput id='phone' value={name} setValue={setname} classname="w-full" label='Phone Number' placeholder="+234-803-12345678"/>
            <DefaultInput id='bio' value={name} setValue={setname} classname="w-full" label='Organizer Description / Bio' placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry."/>
        </div>
        {/* {organizationInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))} */}
      </div>
    );
  }

  if (section === "Preferences & Notifications") {
    return (
      <div className="flex flex-col gap-4 pt-[16px] bg-white px-[20px] h-[85vh]">
        {/* <h1 className="text-lg font-semibold">{section}</h1> */}
        <div className="flex justify-between">
            <p className="text-black text-[1rem]">Receive Email Notifications</p>
        <SlideToggle
          toggle={() => setToggle(!toggle)}
          defaultChecked={toggle}
        />
        </div>
        <div className="flex justify-between">
            <p className="text-black text-[1rem]">Receive SMS Alerts</p>
        <SlideToggle
          toggle={() => setToggle(!toggle)}
          defaultChecked={toggle}
        />
        </div>
        <div className="grid w-full gap-[15px] ">
            <DefaultInput id='eventVisibility' value={name} setValue={setname} classname="w-full" label='Default Event Visibility' placeholder="Public"/>
            <DefaultInput id='Currency' value={name} setValue={setname} classname="w-full" label='Currency' placeholder="₦ Naira "/>
        </div>
        {/* {preferenceInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))} */}
      </div>
    );
  }

  if (section === "Security") {
    return (
      <div className="flex flex-col gap-4 pt-[16px] bg-white px-[20px] h-[85vh]">
        <div className="flex flex-col w-full gap-[15px] pt-[16px] ">
            <DefaultInput id='profileSecurityPin' value={name} setValue={setname} classname="w-full" label='PIN' placeholder="***"/>
            {/* <DefaultInput id='profileSecurityPhone' value={name} setValue={setname} classname="w-full" label='Phone Number' placeholder="+234-803-12345678"/> */}
            <DefaultInput id='profileSecurityTwoFactor' value={name} setValue={setname} classname="w-full" label='Two-Factor Authentication' placeholder="Disable"/>
        </div>
        {/* {securityInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))} */}
      </div>
    );
  }

  if (section === "Account Actions") {
    return (
      <div className="flex flex-col gap-4 pt-[16px] bg-white px-[20px] h-[85vh]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center text-primary text-sm gap-2 cursor-pointer hover:text-darkRed text-[1.2rem] border rounded-md py-[12.5px] px-[15px] w-full border-[#DEDEDE]">
            <RiDeleteBin5Line />
            <p>Delete Account</p>
          </div>
          <div 
            onClick={handleLogout}
            className="flex items-center text-primary text-sm gap-2 cursor-pointer hover:text-darkRed text-[1.2rem] border rounded-md py-[12.5px] px-[15px] w-full border-[#DEDEDE]"
          >
            <RiLogoutCircleRLine />
            <p>Logout</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfileSection;
