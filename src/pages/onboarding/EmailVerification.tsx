import { useNavigate } from "react-router";
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import { useOnboardingStore } from "../../stores/onboardingStore";
import emailPic from "../../assets/images/email.svg";
import DefaultButton from "../../components/buttons/DefaultButton";
import { Verifyotp } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";
import maskEmail from "../../components/helpers/maskedEmail";

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { markStepComplete } = useOnboardingStore();

  const email = Storage.getItem('email') || null
  useEffect(() => {
      if (!email) {
       navigate("/signup", { replace: true, state: {
         toast: { type: "error", title: "Auth invalid", message: "Please sign up/login first" },
       }});
      }
    }, []);
  const handleNext = async(e:any) => {
e.preventDefault()
    try {
      if (otp.length < 4) {
        return;
      }
      const res=await Verifyotp(email, otp)
      Storage.setItem('token', res.accessToken)
      Storage.setItem('user', res.user)
      markStepComplete("emailVerification");
      navigate("/passwordSetup", { replace: true });
    } catch (error) {
      
    }
  };
  const encryptedEmail = email ? maskEmail(email) : "";

  return (
    <form className="flex flex-col flex-grow  justify-between h-full" onSubmit={handleNext}>
      <div className="grid mx-auto gap-[20px] h-fit">
        <div className=" grid text-center">
          <h1 className="text-[22px] md:text-[36px] font-bold">Email Verification</h1>
          <p className="text-[14px] md:text-[18px]">Verification code sent to {encryptedEmail}</p>
        </div>
        <img src={emailPic} alt="a man receiving an email" className="m-auto" />
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span className="mx-[15px]"> </span>}
          renderInput={(props) => (
            <input
              {...props}
              className="border border-gray-300 rounded !w-[54px] mx-auto !h-[54px] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary"
            />
          )}
        />
        <p className="text-center text-primary text-[16px] font-medium cursor-pointer">Resend OTP</p>
      </div>
      <DefaultButton
        type="default"
        variant="primary"
        className="!w-full md:!w-fit md:!mx-auto"
        onClick={()=>handleNext}
        submitType="submit"
      >
        Next
      </DefaultButton>
    </form>
  );
};

export default EmailVerification;