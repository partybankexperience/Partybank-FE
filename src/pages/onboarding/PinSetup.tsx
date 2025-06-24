import OTPInput from "react-otp-input";
import DefaultButton from "../../components/buttons/DefaultButton";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import pin from "../../assets/images/pinImage.svg";
import { SetPin } from "../../Containers/onBoardingApi";
const PinSetup = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setisLoading] = useState(false)
    const navigate = useNavigate();
    const { markStepComplete ,updateOnboardingStep} = useOnboardingStore();
  
    const handleNext =async (e:any) => {
      e.preventDefault();
      if (otp.length < 4) {
        return;
      }
      // Handle the OTP submission logic here
      try {
        setisLoading(true);
        const res = await SetPin(otp);
        updateOnboardingStep(res.currentStep);
        markStepComplete("pinSetup");
        navigate("/createEventSeries", { replace: true });
      } catch (error) {setisLoading(false);}finally{
        setisLoading(false);
      }
    };
    const handleBack = () => {
        navigate(-1);
    
      }
    return (
      <form className="flex flex-col flex-grow  justify-between h-full" onSubmit={handleNext}>
        <div className="grid mx-auto gap-[20px] h-fit">
          <div className=" grid text-center">
            <h1 className="text-[22px] md:text-[36px] font-bold">PIN Setup</h1>
            <p className="text-[14px] md:text-[18px] text-grey400">This PIN will be required for financial transactions inside the dashboard.</p>
          </div>
          <img src={pin} alt="a man receiving an email" className="m-auto" />
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputType="tel"
            renderSeparator={<span className="mx-[28px]"> </span>}
            renderInput={(props) => (
              <input
                {...props}
                className="border border-gray-300 rounded !w-[54px] !h-[54px] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary !mx-auto"
              />
            )}
          />
          <p className="text-center text-primary text-[16px] font-medium cursor-pointer">Resend OTP</p>
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
}

export default PinSetup