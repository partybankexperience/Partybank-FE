import { LuPencilLine } from "react-icons/lu";
import DefaultButton from "../../components/buttons/DefaultButton";
import { IoCameraOutline } from "react-icons/io5";
import SlideToggle from "../../components/inputs/SlideToggle";
import { useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import ProfileSection from "./ProfileSection";
import { useProfileSectionStore } from "../../stores/useProfileStore";

const Profile = () => {
    const [toggle, settoggle] = useState(false)
    const personalInfo=[{name:'Full Name :',value:'Jane Cooper'},{name:'Email Address :',value:'janecooper@gmail.com'},{name:'Phone Number :',value:'+234-803-12345678'}]
    const preferenceInfo=[{name:'Default Event Visibility :',value:'Public'},{name:'Currency :',value:'₦ Naira '}]
    const SecurityInfo=[{name:'PIN :',value:'***'},{name:'Two-Factor Authentication :',value:'Disable '}]
    const organizationInfo=[{name:'Business / Organizer Name :',value:'Tincidunt Food'},{name:'Phone Number :',value:'+234-803-12345678'},{name:'Social Media Links :',value:'+234-803-12345678'},{name:'Organizer Description / Bio :',value:'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}]
    const profileNav=['Personal Information','Organization Details','Preferences & Notifications','Security','Account Actions']
    // const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const { section,setSection } = useProfileSectionStore();
  return (
    <>
    {/* small screens */}
    <div className="md:hidden">

    {section ? (
  <ProfileSection
    section={section}
    personalInfo={personalInfo}
    preferenceInfo={preferenceInfo}
    securityInfo={SecurityInfo}
    organizationInfo={organizationInfo}
    toggle={toggle}
    setToggle={settoggle}
    onBack={() => setSection(null)}
  />
) : (
    <div className="bg-white p-[16px] flex flex-col gap-[20px] h-[85vh]">
    {profileNav.map((item, index) => (
        <button onClick={() => setSection(item)} key={index} className="border rounded-md py-[12.5px] px-[15px] flex w-full h-fit justify-between items-center text-[#DEDEDE]">
        <p className="text-[1rem] text-black font-medium">{item}</p>
        <IoIosArrowForward />
    </button>
    ))}

</div>
)}
    </div>
    {/* big screens */}
    <div className="hidden bg-white rounded-md p-[20px] min-h-[80vh] md:flex flex-col gap-[20px]">
      <div className="border p-[20px] border-[#E1E1E1] rounded-md grid gap-[20px] h-fit">
        <div className="flex justify-between">
          <h1 className="text-[1.2rem] text-black">Personal Information</h1>
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border"
          >
            Edit
          </DefaultButton>
        </div>
        <div className="flex gap-[4rem] items-center">
            <div className="w-[6rem] h-[6rem] rounded-full relative bg-grey">
                <img src="" alt="profilePic" />
                <div className="absolute h-[36px] w-[36px] rounded-full bg-primary bottom-0 right-[-.5rem] grid justify-center items-center border-[2px] border-white">
                <IoCameraOutline className="text-white text-[1.2rem] "/>
                </div>
            </div>
            <div className="grid w-[38rem] grid-cols-3 ">
                {personalInfo.map((item, index) => (
                    <div key={index} className="grid gap-1">
                    <p className="text-lightGrey text-[.8rem]">{item.name}</p>
                    <p className="text-black text-[.9rem] font-bold">{item.value}</p>
                    </div>
                ))}
                
            </div>
        </div>
      </div>
      <div className="border p-[20px] border-[#E1E1E1] rounded-md grid gap-[20px] h-fit">
        <div className="flex justify-between">
          <h1 className="text-[1.2rem] text-black">Organization Details</h1>
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border"
          >
            Edit
          </DefaultButton>
        </div>
        <div className="flex gap-[4rem] items-center">
            <div className="w-[6rem] h-[6rem] rounded-full relative bg-grey">
                <img src="" alt="profilePic" />
                <div className="absolute h-[36px] w-[36px] rounded-full bg-primary bottom-0 right-[-.5rem] grid justify-center items-center border-[2px] border-white">
                <IoCameraOutline className="text-white text-[1.2rem] "/>
                </div>
            </div>
            <div className="grid w-[38rem] grid-cols-3 gap-[40px] ">
                {organizationInfo.map((item, index) => (
                    <div key={index} className={`grid gap-1 ${index=== 3 ? 'col-span-3' : ''}`}>
                    <p className="text-lightGrey text-[.8rem]">{item.name}</p>
                    <p className="text-black text-[.9rem] font-bold ">{item.value}</p>
                    </div>
                ))}
                
            </div>
        </div>
      </div>
      <div className="border p-[20px] border-[#E1E1E1] rounded-md grid gap-[20px] h-fit">
        <div className="flex justify-between">
          <h1 className="text-[1.2rem] text-black">Preferences & Notifications</h1>
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border"
          >
            Edit
          </DefaultButton>
        </div>
        <div className="flex gap-[4rem] items-center">
            <div className="flex gap-[20px] items-center">
               <p className="text-black font-bold whitespace-nowrap">Preferences & Notifications</p>
               <SlideToggle toggle={() => settoggle(!toggle)} isChecked={toggle} />
            </div>

            <div className="grid w-full grid-cols-[2fr_1.2fr_1.2fr] gap-[40px] ">
            <div className="flex gap-[20px] items-center">
               <p className="text-black font-bold whitespace-nowrap">Receive SMS Alerts</p>
               <SlideToggle toggle={() => settoggle(!toggle)} isChecked={toggle} />
            </div>
                {preferenceInfo.map((item, index) => (
                    <div key={index} className={`grid gap-1 `}>
                    <p className="text-lightGrey text-[.8rem]">{item.name}</p>
                    <p className="text-black text-[.9rem] font-bold ">{item.value}</p>
                    </div>
                ))}
                
            </div>
        </div>
      </div>
      <div className="border p-[20px] border-[#E1E1E1] rounded-md grid gap-[20px] h-fit">
        <div className="flex justify-between">
          <h1 className="text-[1.2rem] text-black">Security</h1>
          <DefaultButton
            variant="tertiary"
            type="icon-left"
            icon={<LuPencilLine className="text-[1rem]" />}
            className="h-fit border"
          >
            Edit
          </DefaultButton>
        </div>
        <div className="flex gap-[4rem] items-center">
            

            <div className="grid  grid-cols-2 gap-[40px] ">
           
                {SecurityInfo.map((item, index) => (
                    <div key={index} className={`grid gap-1 `}>
                    <p className="text-lightGrey text-[.8rem]">{item.name}</p>
                    <p className="text-black text-[.9rem] font-bold ">{item.value}</p>
                    </div>
                ))}
                
            </div>
        </div>
      </div>
      <div className="border p-[20px] border-[#E1E1E1] rounded-md grid gap-[20px] h-fit">
        <div className="flex justify-between">
          <h1 className="text-[1.2rem] text-black">Account Actions</h1>
        </div>
        <div className="flex gap-[4rem] items-center">
            

            <div className="grid  grid-cols-2 gap-[40px] ">
           
               <div className="flex gap-1 items-center text-primary text-[.9rem] cursor-pointer hover:text-darkRed">
               <RiDeleteBin5Line />
                <p className="">Delete Account</p>
               </div>
               <div className="flex gap-1 items-center text-primary text-[.9rem] cursor-pointer hover:text-darkRed">
               <RiLogoutCircleRLine />
                <p className="">Logout</p>
               </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
