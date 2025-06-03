import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { forgotPassword, forgotPasswordConfirmOTP, resetPassword } from "../../../Containers/onBoardingApi";
import LoginLayout from "../../../components/layouts/LoginLayout";
import StepOne from "./Step1";
import StepTwo from "./Step2";
import StepThree from "./Step3";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Warn on refresh or back
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step !== 1) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = () => {
      if (step !== 1 && window.confirm("Are you sure you want to leave this page?")) {
        setStep(1);
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setEmailError(true);
    try {
      setIsLoading(true);
      await forgotPassword(email);
      setStep(2);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return alert("Enter valid 4-digit OTP.");
    try {
      setIsLoading(true);
      await forgotPasswordConfirmOTP(email, otp);
      setStep(3);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) return alert("Passwords do not match.");
    try {
      setIsLoading(true);
      await resetPassword(email, password, confirmPassword);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginLayout>
      {step === 1 && (
        <StepOne
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
          onSubmit={handleStep1Submit}
          isLoading={isLoading}
        />
      )}
      {step === 2 && (
        <StepTwo
          email={email}
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleStep2Submit}
          isLoading={isLoading}
        />
      )}
      {step === 3 && (
        <StepThree
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleStep3Submit}
          isLoading={isLoading}
        />
      )}
    </LoginLayout>
  );
};

export default ForgotPassword;
