import { useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FiCheck } from "react-icons/fi";
import { useState } from "react";
import { SetPassword } from "../../Containers/onBoardingApi";

const PasswordSetup = () => {
  const navigate = useNavigate();
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setisLoading] = useState(false)
  const { markStepComplete,updateOnboardingStep } = useOnboardingStore();

  const handleNext = async () => {
    try {
      setisLoading(true);
      const res=await SetPassword(confirmPassword,password)
      updateOnboardingStep(res.currentStep);
      markStepComplete("passwordSetup");
      navigate("/profileInformation", { replace: true });
    } catch (error) {setisLoading(false);}finally{
      setisLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const passwordVerification = [
    { label: "Minimum 8 characters", check: password.length >= 8 },
    { label: "Mix of letters", check: /[a-zA-Z]/.test(password) },
    {
      label: "Numbers and symbols",
      check: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
  return (
    <div className="flex flex-col flex-grow  justify-between h-full px-[20px] md:px-0">
      <div
        className="h-fit grid
        gap-[50px]"
      >
        <h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">
          Password Setup
        </h1>
        <div className="grid md:w-fit md:m-auto">
          <DefaultInput
            id="password"
            label="Password"
            placeholder="Write password"
            type="password"
            style="!w-full"
            value={password}
            setValue={setpassword}
          />
          <div className="grid gap-[10px] md:flex items-center">
            {passwordVerification.map((item, index) => (
              <div
                className="flex items-center gap-[8px] text-grey200 text-[14px]"
                key={index}
              >
                <FiCheck />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:w-fit md:m-auto">
          <DefaultInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="rewrite password"
            type="password"
            style="!w-full"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
          <div className="grid gap-[10px] md:flex items-center">
            {passwordVerification.map((item, index) => (
              <div
                className="flex items-center gap-[8px] text-grey200 text-[14px]"
                key={index}
              >
                <FiCheck />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-[20px] items-center mx-auto">
        <div
          className="h-fit grid
        gap-[50px]"
        >
          <h1 className="text-[24px] md:text-[36px] font-bold text-black text-center">
            Password Setup
          </h1>
          <div className="grid md:w-fit md:m-auto">
            <DefaultInput
              id="password"
              label="Password"
              placeholder="Write password"
              type="password"
              style="!w-full"
              value={password}
              setValue={setpassword}
            />
            <div className="grid gap-[10px] md:flex items-center">
              {passwordVerification.map((item, index) => (
                <div
                  className={`flex items-center gap-[8px] text-[14px] ${
                    item.check ? "text-green-800" : "text-grey200"
                  }`}
                  key={index}
                >
                  <FiCheck />
                  <p>{item.label}</p>
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
            isLoading={isLoading}
          >
            Next
          </DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetup;
