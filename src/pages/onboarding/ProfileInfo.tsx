import { useNavigate } from "react-router";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { useState } from "react";
import { SetProfile } from "../../Containers/onBoardingApi";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setisLoading] = useState(false)
  const { markStepComplete,updateOnboardingStep } = useOnboardingStore();

  const handleNext = async (e:any) => {
    e.preventDefault();
    if (fullName.length < 0) {
      console.log('here')
      return;
    }
    try {
      setisLoading(true);
      const res = await SetProfile(fullName, businessName,phone);
      updateOnboardingStep(res.currentStep);
      markStepComplete("profileInformation");
      navigate("/pinSetup", { replace: true });
    } catch (error) {setisLoading(false);}finally{
      setisLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <form className="flex flex-col flex-grow  justify-between h-full px-[20px] md:px-0" onSubmit={handleNext}>
      <div
        className="h-fit grid
          gap-[50px]"
          
      >
        <h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">
          Profile Information
        </h1>
        <div className="grid w-full md:w-3/4 lg:w-1/2 md:m-auto gap-[20px]">
          <DefaultInput
            id="profileInfoFullName"
            label="Full Name"
            placeholder="Enter full name"
            type="text"
            style="!w-full"
            value={fullName}
            setValue={setFullName}
            required
          />
          <DefaultInput
            id="profileInfoBusinessName"
            label="Business Name"
            placeholder="Enter business name"
            type="text"
            style="!w-full"
            value={businessName}
            setValue={setBusinessName}
          />
          <DefaultInput
            id="profileInfoPhone"
            label="Phone Number"
            placeholder="Enter Phone Number"
            type="text"
            style="!w-full"
            value={phone}
            setValue={setPhone}
          />
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
          onClick={()=>handleNext}
          submitType="submit"
          isLoading={isLoading}
        >
          Next
        </DefaultButton>
      </div>
    </form>
  );
};

export default ProfileInfo;
