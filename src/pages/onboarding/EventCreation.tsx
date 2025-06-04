import { useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton"
import { useOnboardingStore } from "../../stores/onboardingStore";
import { LuPencilLine } from "react-icons/lu";
import { BiSolidCalendarStar } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { Modal } from "../../components/modal/Modal";
import { useState } from "react";
import createEvent from "../../assets/images/createEvent.svg";
import DefaultInput from "../../components/inputs/DefaultInput";
import { ImageUploadInput } from "../../components/inputs/ImageInput";
import { CreateSeries } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";

const EventCreation = () => {
    const navigate = useNavigate();
    const { markStepComplete } = useOnboardingStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateSeriesModalOpen, setIsCreateSeriesModalOpen] = useState(false);
    const [seriesName, setSeriesName] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const handleNext = () => {
        try {
            // const res=await CreateSeries(confirmPassword,password)
            markStepComplete("pinSetup");
            setIsModalOpen(true);
            // navigate("/dashboard");
          } catch (error) {
            
          }
      markStepComplete("pinSetup");
      setIsModalOpen(true);
    //   navigate("/createEventSeries");
    };

    const handleCreateSeries = async () => {
        if (!seriesName.trim() || !description.trim()) {
            return;
        }
        
        try {
            const user = Storage.getItem("user");
            const userId = user?.id;
            
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            const response = await CreateSeries(
                seriesName,
                userId,
                description,
                coverImage || "https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            );
            
            console.log("Series created:", response);
            setIsCreateSeriesModalOpen(false);
            setSeriesName("");
            setDescription("");
            setCoverImage("");
            markStepComplete("createEventSeries");
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error creating series:", error);
        }
    };
    const handleBack = () => {
        navigate(-1);
      }
  return (
    <div className="flex flex-col flex-grow  justify-between h-full">
        <div className="grid w-full md:mx-auto gap-[20px] h-fit">
          <div className=" grid text-center">
            <h1 className="text-[22px] md:text-[36px] font-bold">Create Event Series</h1>
            <p className="text-[14px] md:text-[18px] text-grey400">You can change this in your dashboard later</p>
          </div>
          <div className="flex gap-[20px] w-full md:w-fit md:m-auto md:gap-[40px]">
            <div className="bg-white rounded-[15px] p-[20px] md:px-[40px] w-full md:w-[20vw] h-[180px]">
                <div className="flex justify-end">
                <LuPencilLine className="text-primary w-[20px] cursor-pointer"/>
                </div>

                <div className="p-[10px] bg-[rgba(233,27,65,0.08)] rounded-[8px] w-fit mb-[30px]">
                <BiSolidCalendarStar className="text-primary w-[26px] h-[26px]" />
                </div>

                <p className="text-black text-[18px] font-medium">My Events</p>
            </div>
            <div
  className="bg-white rounded-[15px] p-[20px] flex flex-col items-center justify-center m-auto w-full text-center md:w-[20vw] h-[180px] border border-dotted border-primary cursor-pointer hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
  style={{ borderWidth: "2px", borderStyle: "dotted" }}
  onClick={() => setIsCreateSeriesModalOpen(true)}
>
  <FaPlus className="text-primary text-[40px] mb-2" />
  <p className="text-center text-[18px] font-medium text-black">Create New Series</p>
</div>

          </div>
          </div>
          <div className="flex gap-[20px] items-center mx-auto">
          <DefaultButton
          type="default"
          variant="tertiary"
          className="!w-full md:!w-fit md:!mx-auto"
          onClick={handleBack}
        >
          Back
        </DefaultButton>
        <DefaultButton
          type="default"
          variant="primary"
          className="!w-full md:!w-fit md:!mx-auto"
          onClick={handleNext}
        >
          Finish
        </DefaultButton>
  
          </div>
          <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="m-auto 4vw grid gap-[20px] text-center">
            <img src={createEvent} alt="" className="m-auto" />
            <h1 className="font-bold text-[#231F20] text-[36px]">All Set!</h1>
            <p className="text-lightGrey text-[16px]">You're all set to create and manage your dream event. Let’s get started!</p>
            <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-fit md:!mx-auto"
            onClick={() => {
                // setIsModalOpen(false);
                navigate("/dashboard");
            }
            }
          >
            Explore
          </DefaultButton>
        </div>
      </Modal>

      <Modal isOpen={isCreateSeriesModalOpen} onClose={() => setIsCreateSeriesModalOpen(false)}>
        <h1 className="text-[1.5rem] text-black font-medium text-center ">Create Series</h1>
        <div className="m-auto 4vw grid gap-[20px] w-full ">
          <DefaultInput
            label="Series Name"
            id="eventSeriesName"
            value={seriesName}
            setValue={setSeriesName}
            placeholder="e.g., Lagos Concerts 2025 or VIP Exclusive"
            classname="!w-full"
          />
          <DefaultInput
            label="Description"
            id="eventSeriesDescription"
            value={description}
            setValue={setDescription}
            placeholder="e.g., Multi-location music tour with similar theme"
            classname="!w-full"
          />
          <ImageUploadInput/>
          <div className="md:mx-auto grid md:flex gap-[20px] ">
          <DefaultButton
            type="default"
            variant="tertiary"
            className="!w-full md:!w-[9rem] md:!mx-auto border"
            onClick={() => {
                setIsCreateSeriesModalOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-[9rem] md:!mx-auto"
            onClick={handleCreateSeries}
          >
            Create Series
          </DefaultButton>
          </div>
        </div>
      </Modal>
          </div>
  )
}

export default EventCreation