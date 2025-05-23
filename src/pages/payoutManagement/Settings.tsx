import { LuPencilLine } from "react-icons/lu";
import DefaultButton from "../../components/buttons/DefaultButton";
import SlideToggle from "../../components/inputs/SlideToggle";
import { useState } from "react";

const Settings = () => {
  const [toggle, settoggle] = useState(false);
  const account = [
    { name: "Bank Name :", des: "Citibank Nigeria Ltd" },
    { name: "Account Holder Name :", des: "John Doe" },
    { name: "Account Number :", des: "****5678" },
    { name: "SWIFT Code :", des: "CITINGLA" },
    { name: "Status :", des: "" },
  ];

  return (
    <div className="bg-white rounded-md h-[80vh] p-[20px] ">
  {/* Left Column */}
  <div className="h-fit grid md:grid-cols-2 gap-[20px]  items-start">
  <div className="grid gap-[20px] h-fit">
    <h1 className="font-medium text-[1.5rem] text-black">Bank Account Setup</h1>
    <div className="border border-[#E1E1E1] rounded-md p-[20px] flex justify-between h-fit">
      <div className="grid grid-cols-2 gap-[15px]">
        {account.map((item, index) => (
          <div key={index} className="grid gap-1">
            <p className="text-lightGrey text-[.7rem]">{item.name}</p>
            <p className="text-black text-[.8rem] font-bold">{item.des}</p>
          </div>
        ))}
        <div className="grid gap-1">
          <p className="text-lightGrey text-[.8rem]">Bank Name :</p>
          <p className="text-black text-[.9rem] font-bold">
            Citibank Nigeria Ltd
          </p>
        </div>
      </div>
      <DefaultButton
        type="icon-left"
        variant="tertiary"
        icon={<LuPencilLine className="text-[1rem]" />}
        onClick={() => {}}
        className="h-fit border"
      >
        Edit
      </DefaultButton>
    </div>
  </div>

  {/* Right Column (Matches left column height) */}
  <div className="flex flex-col h-full gap-[20px]    ">
    <h1 className="font-medium text-[1.5rem] text-black ">Settlement Notifications</h1>
    <div className="border border-[#E1E1E1] rounded-md p-[20px] flex justify-between h-full items-start">
      <div className="grid gap-3">
        <p className="font-bold text-black text-[.9rem]">
          Enable email or SMS alerts for
        </p>
        <ul className="list-disc list-inside text-lightGrey text-[.8rem]">
          <li>Successful payouts</li>
          <li>Failed payouts (including reason)</li>
        </ul>
      </div>
      <div>
        <SlideToggle
          toggle={() => settoggle(!toggle)}
          defaultChecked={toggle}
        />
      </div>
    </div>
  </div>

  </div>
</div>



  );
};

export default Settings;
