import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Modal } from "../modal/Modal";
import DefaultButton from "../buttons/DefaultButton";
import { useNavigate } from "react-router";
import DefaultInput from "../inputs/DefaultInput";
import { ImageUploadInput } from "../inputs/ImageInput";

const CreateNewSeries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div
        className="bg-[#FFF2F4] rounded-[10px] px-[20px] min-h-fit h-[157px] md:h-full min-w-[180px] w-full grid justify-center items-center cursor-pointer hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
        role="button"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div className="grid gap-[20px] text-center">
          <div className="bg-white rounded-[6px] p-[14px] h-fit w-fit m-auto">
            <FaPlus className="text-[32px] text-primary" />
          </div>
          <div className="grid gap-[8px] text-center">
            <p className="text-black font-medium text-[1.125rem]">
              Create New Series
            </p>
            <p className="text-lightGrey font-medium text-[.875rem]">
              Create a series to keep your events put together
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-[1.5rem] text-black font-medium text-center ">Create Series</h1>
        <div className="m-auto 4vw grid gap-[20px] w-full ">
          <DefaultInput
            label="Series Name"
            id="Series Name"
            value={seriesName}
            setValue={setSeriesName}
            placeholder="e.g., Lagos Concerts 2025 or VIP Exclusive"
            classname="!w-full"
          />
          <DefaultInput
            label="Description"
            id="Description"
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
                setIsModalOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-[9rem] md:!mx-auto"
            onClick={() => {
              console.log("Series:", seriesName);
              console.log("Description:", description);
              navigate("/dashboard");
            }}
          >
            Create Series
          </DefaultButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateNewSeries;
