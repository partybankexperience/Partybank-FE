import { useNavigate } from "react-router";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { useOnboardingStore } from "../../stores/onboardingStore";
import email from "../../assets/images/email.svg";
import DefaultButton from "../../components/buttons/DefaultButton";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { markStepComplete } = useOnboardingStore();

  const handleNext = () => {
    markStepComplete("emailVerification");
    navigate("/passwordSetup");
  };

  return (
    <div className="flex flex-col flex-grow  justify-between h-full">
      <div className="grid mx-auto gap-[20px] h-fit">
        <div className=" grid text-center">
          <h1 className="text-[22px] md:text-[36px] font-bold">Email Verification</h1>
          <p className="text-[14px] md:text-[18px]">Verification code sent to j*********0@gmail.com</p>
        </div>
        <img src={email} alt="a man receiving an email" className="m-auto" />
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span className="mx-[28px]"> </span>}
          renderInput={(props) => (
            <input
              {...props}
              className="border border-gray-300 rounded !w-[54px] !h-[54px] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary"
            />
          )}
        />
        <p className="text-center text-primary text-[16px] font-medium cursor-pointer">Resend OTP</p>
      </div>
      <DefaultButton
        type="default"
        variant="primary"
        className="!w-full md:!w-fit md:!mx-auto"
        onClick={handleNext}
      >
        Next
      </DefaultButton>
    </div>
  );
};

export default EmailVerification;