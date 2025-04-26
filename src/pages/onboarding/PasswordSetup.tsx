import { useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FiCheck } from "react-icons/fi";

const PasswordSetup = () => {
  const navigate = useNavigate();
  const { markStepComplete } = useOnboardingStore();

  const handleNext = () => {
    markStepComplete("passwordSetup");
    navigate("/profileInformation");
  };
  const handleBack = () => {
    navigate(-1);

  }
  const passwordVerification=['Minimum 8 characters','Mix of letters','Numbers and symbols']
  return (
    <div className="flex flex-col flex-grow  justify-between h-full px-[20px] md:px-0">
        <div className="h-fit grid
        gap-[50px]">
<h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">Password Setup</h1>
<div className="grid md:w-fit md:m-auto">
    <DefaultInput id='password' label='Password' placeholder="Write password" type="password" style="!w-full"/>
<div className="grid gap-[10px] md:flex items-center">
    {passwordVerification.map((item,index)=>(
    <div className="flex items-center gap-[8px] text-grey200 text-[14px]" key={index}>
    <FiCheck />
    <p>{item}</p>
    </div>

    ))}
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
        Next
      </DefaultButton>

        </div>
    </div>
  )
}

export default PasswordSetup