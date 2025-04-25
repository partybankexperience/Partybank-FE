import { useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { useOnboardingStore } from "../../stores/onboardingStore";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const { markStepComplete } = useOnboardingStore();
  
    const handleNext = () => {
      markStepComplete("profileInformation");
      navigate("/pinSetup");
    };
    const handleBack = () => {
      navigate(-1);
  
    }
    return (
      <div className="flex flex-col flex-grow  justify-between h-full px-[20px] md:px-0">
          <div className="h-fit grid
          gap-[50px]">
  <h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">Profile Information</h1>
  <div className="grid w-full md:w-3/4 lg:w-1/2 md:m-auto gap-[20px]">
      <DefaultInput id='fullName' label='Full Name' placeholder="Enter full name" type="text" style="!w-full"/>
      <DefaultInput id='businessName' label='Business Name' placeholder="Enter business name" type="text" style="!w-full"/>
 
  
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
          Next
        </DefaultButton>
  
          </div>
      </div>
    )
}

export default ProfileInfo