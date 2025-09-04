import { useNavigate } from 'react-router';
import OtpInput from 'react-otp-input';
import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import emailPic from '../../assets/images/email.svg';
import DefaultButton from '../../components/buttons/DefaultButton';
import { resendOTP, Verifyotp } from '../../Containers/onBoardingApi';
import { Storage } from '../../stores/InAppStorage';
import maskEmail from '../../components/helpers/maskedEmail';
import { formatCountdownTimer } from '../../components/helpers/dateTimeHelpers';

const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(600);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { markStepComplete } = useOnboardingStore();

  const email = Storage.getItem('email') || null;
  useEffect(() => {
    if (!email) {
      navigate('/signup', {
        replace: true,
        state: {
          toast: { type: 'error', title: 'Auth invalid', message: 'Please sign up/login first' },
        },
      });
    }
  }, []);
  const handleNext = async (e: any) => {
    e.preventDefault();
    try {
      setisLoading(true);
      if (otp.length < 4) {
        return;
      }
      const res = await Verifyotp(email, otp);
      Storage.setItem('token', res.accessToken);
      Storage.setItem('user', res.user);
      markStepComplete('emailVerification');
      navigate('/password-setup', { replace: true });
    } catch (error) {
      setisLoading(false);
    } finally {
      setisLoading(false);
    }
  };
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
      setisLoading(true);
      await resendOTP(email, 'signup');
      setTimer(60); // Reset timer
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };
  const encryptedEmail = email ? maskEmail(email) : '';

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
          inputType="tel"
          renderSeparator={<span className="mx-[15px]"> </span>}
          renderInput={(props) => (
            <input
              {...props}
              className="border border-gray-300 rounded !w-[54px] mx-auto !h-[54px] md:!w-[4vw] md:!h-[4vw] !bg-white text-black text-center focus:outline-none focus:border-primary"
            />
          )}
        />
        <button
          type="button"
          onClick={handleResendOtp}
          className={`text-center text-[16px] font-medium ${
            timer > 0 ? 'text-grey300 cursor-not-allowed' : 'text-primary'
          }`}
          disabled={timer > 0}
        >
          {timer > 0 ? `Resend OTP in ${formatCountdownTimer(timer)}s` : 'Resend OTP'}
        </button>
      </div>
      <DefaultButton
        type="default"
        variant="primary"
        className="!w-full md:!w-fit md:!mx-auto"
        onClick={() => handleNext}
        submitType="submit"
        isLoading={isLoading}
        disabled={otp.length < 4}
      >
        Next
      </DefaultButton>
    </form>
  );
};

export default EmailVerification;
