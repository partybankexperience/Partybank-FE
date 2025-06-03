
import { useNavigate } from "react-router";
import DefaultInput from "../../../components/inputs/DefaultInput";
import DefaultButton from "../../../components/buttons/DefaultButton";

const StepThree = ({ password, confirmPassword, setPassword, setConfirmPassword, onSubmit, isLoading }:any) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit">
      <div className="grid gap-[10px] text-center md:text-left">
        <h1 className="text-black text-[24px] md:text-[36px] font-bold">Reset Password</h1>
        <p className="text-lightGrey text-[20px]">Enter your new password below.</p>
      </div>
      <div className="grid w-full gap-[18px]">
        <DefaultInput
          id="password"
          label="New Password"
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="Enter new password"
          classname="!w-full"
        />
        <DefaultInput
          id="confirm"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="Confirm password"
          classname="!w-full"
        />
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
          Reset Password
        </DefaultButton>
      </div>
      <p className="text-grey200 text-[16px] mt-[1.1vh] text-center">
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

export default StepThree;
