import { LuPencilLine } from "react-icons/lu";
import DefaultButton from "../../components/buttons/DefaultButton";
import SlideToggle from "../../components/inputs/SlideToggle";
import { useState } from "react";
import { Modal } from "../../components/modal/Modal";
import { useNavigate } from "react-router";
import DefaultInput from "../../components/inputs/DefaultInput";

const Settings = () => {
  const [toggle, settoggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [bankName, setbankName] = useState('')
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
        onClick={() => setIsModalOpen(true)}
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
          isChecked={toggle}
        />
      </div>
    </div>
  </div>

  </div>
  <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="m-auto 4vw grid gap-[20px]">
            <h1 className="text-black text-[1.5rem] font-bold text-center">Update Bank Details</h1>
           <DefaultInput value={bankName} setValue={setbankName} placeholder="Citibank Nigeria Ltd" label="Bank Name" id='bankName' classname="!w-full"/>
           <DefaultInput value={bankName} setValue={setbankName} placeholder="John Doe" label="Account Holder Name" id='accountHolderName' classname="!w-full"/>
           <DefaultInput value={bankName} setValue={setbankName} placeholder="452612535678" label="Account Number " id='acctNo' classname="!w-full"/>
           <DefaultInput value={bankName} setValue={setbankName} placeholder="CITINGLA" label="SWIFT Code" id='swiftCode' classname="!w-full"/>
           <div className="flex gap-[20px]">
            <DefaultButton
            type="default"
            variant="tertiary"
            className="!w-full  border"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </DefaultButton>
            <DefaultButton
            type="default"
            variant="primary"
            className="!w-full  "
            onClick={() => {
                // setIsModalOpen(false);
                navigate("/dashboard");
            }
            }
          >
            Update
          </DefaultButton>
           </div>
        </div>
      </Modal>
</div>



  );
};

export default Settings;
