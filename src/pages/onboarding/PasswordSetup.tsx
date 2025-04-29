import { useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FiCheck } from "react-icons/fi";
import { useState } from "react";
import { SetPassword } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";

const PasswordSetup = () => {
  const navigate = useNavigate();
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { markStepComplete } = useOnboardingStore();

  const handleNext = async () => {
    try {
      const res=await SetPassword(confirmPassword,password)
      Storage.setItem('user', res.user)
      markStepComplete("passwordSetup");
      navigate("/profileInformation", { replace: true });
    } catch (error) {
      
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const passwordVerification = [
    "Minimum 8 characters",
    "Mix of letters",
    "Numbers and symbols",
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
                <p>{item}</p>
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
  );
};

export default PasswordSetup;
