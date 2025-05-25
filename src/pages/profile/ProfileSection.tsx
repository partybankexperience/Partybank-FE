
import { RiLogoutCircleRLine, RiDeleteBin5Line } from "react-icons/ri";
import SlideToggle from "../../components/inputs/SlideToggle";

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
  if (section === "Personal Information") {
    return (
      <div className="grid gap-4">
        <button className="text-blue-600 text-sm font-medium" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold">{section}</h1>
        {personalInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section === "Organization Details") {
    return (
      <div className="grid gap-4">
        <button className="text-blue-600 text-sm font-medium" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold">{section}</h1>
        {organizationInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section === "Preferences & Notifications") {
    return (
      <div className="grid gap-4">
        <button className="text-blue-600 text-sm font-medium" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold">{section}</h1>
        <SlideToggle toggle={() => setToggle(!toggle)} defaultChecked={toggle} />
        {preferenceInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section === "Security") {
    return (
      <div className="grid gap-4">
        <button className="text-blue-600 text-sm font-medium" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold">{section}</h1>
        {securityInfo.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-gray-500 text-sm">{item.name}</p>
            <p className="text-black font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    );
  }

  if (section === "Account Actions") {
    return (
      <div className="grid gap-4">
        <button className="text-blue-600 text-sm font-medium" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold">{section}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center text-primary text-sm gap-2 cursor-pointer hover:text-darkRed">
            <RiDeleteBin5Line />
            <p>Delete Account</p>
          </div>
          <div className="flex items-center text-primary text-sm gap-2 cursor-pointer hover:text-darkRed">
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
