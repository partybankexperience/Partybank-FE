
import { useNavigate } from "react-router";
import DefaultInput from "../../../components/inputs/DefaultInput";
import DefaultButton from "../../../components/buttons/DefaultButton";

const StepOne = ({ email, setEmail, emailError, setEmailError, onSubmit, isLoading }:any) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit">
      <div className="grid gap-[10px] text-center md:text-left">
        <h1 className="text-black text-3xl font-semibold">Forgot Password?</h1>
        <p className="text-lightGrey font-normal text-sm">Enter your email to reset your password.</p>
      </div>
      <div className="grid w-full gap-[18px]">
        <DefaultInput
          id="email"
          label="Email"
          placeholder="Enter your email address"
          type="email"
          style="!w-full"
          value={email}
          setValue={(val:any) => {
            setEmail(val);
            if (emailError && val) setEmailError(false);
          }}
          required
          setExternalError={setEmailError}
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

export default StepOne;
