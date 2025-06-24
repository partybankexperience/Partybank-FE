import OTPInput from "react-otp-input";
import { useNavigate } from "react-router";
import DefaultButton from "../../../components/buttons/DefaultButton";
import maskEmail from "../../../components/helpers/maskedEmail";
import { useEffect, useState } from "react";
import { resendOTP } from "../../../Containers/onBoardingApi";
import { formatCountdownTimer } from "../../../components/helpers/dateTimeHelpers";

const StepTwo = ({ email, otp, setOtp, onSubmit, isLoading}:any) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(600);
  const [isResendOTPLoading, setisResendOTPLoading] = useState(false)
  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);
  const handleResendOtp = async () => {
    try {
      setisResendOTPLoading(true);
      await resendOTP(email);
      setTimer(60); // Reset timer
    
     
    } catch (error) {
      
    } finally {
      setisResendOTPLoading(false);
    }}
  const encryptedEmail = email ? maskEmail(email) : "";
  console.log(timer, "timer in step 2");
  return (
    <form onSubmit={onSubmit} className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit">
      <div className="grid gap-[10px] text-center md:text-left">
        <h1 className="text-black text-3xl font-semibold">Verify OTP</h1>
        <p className="text-lightGrey font-normal text-sm">Enter the 4-digit OTP sent to {encryptedEmail}</p>
      </div>
      <div className="grid w-full gap-[18px]">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          inputType="tel"
          renderSeparator={<span className="mx-[28px]"> </span>}
          renderInput={(props) => (
            <input
              {...props}
              className="border border-gray-300 rounded !w-[3.3rem] !h-[3.3rem] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary !mx-auto"
            />
          )}
        />
        <button
          type="button"
          onClick={handleResendOtp}
          className={`text-center text-[14px] font-medium cursor-pointer ${
            timer > 0 ? "text-grey200 cursor-not-allowed" : "text-primary"
          }`}
          disabled={timer > 0 || isResendOTPLoading}
        >
          {timer > 0 ? `Resend OTP in ${formatCountdownTimer(timer)}s` : "Resend OTP"}
        </button>
      </div>
      <div className="grid gap-[20px] w-full">
        <DefaultButton
          variant="primary"
          size="normal"
          type="default"
          className="w-full"
          submitType="submit"
          isLoading={isLoading}
        >
          Verify
        </DefaultButton>
      </div>
      <p className="text-grey200 text-[14px]  mt-[0.5vh] text-center">
        Remember your password?{" "}
        <span
          className="text-red font-medium cursor-pointer hover:text-deepRed"
          onClick={() => navigate("/")}
        >
          Sign In
        </span>
      </p>
    </form>
  );
};

export default StepTwo;
