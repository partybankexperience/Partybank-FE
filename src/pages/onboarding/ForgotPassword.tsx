import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useNavigate } from "react-router";
import { useState } from "react";
import { successAlert } from "../../components/alerts/ToastService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setEmailError(true);
      return;
    }
    successAlert("Success", "A password reset link has been sent to your email.");
  };

  return (
    <LoginLayout>
      <form
        onSubmit={handleSubmit}
        className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit w-full md:w-[36vw] lg:w-[28vw] px-[20px] md:px-0 lg:px-0"
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className="text-black text-[24px] md:text-[36px] font-bold">
            Forgot Password?
          </h1>
          <p className="text-lightGrey text-[20px]">
            Enter your email to reset your password.
          </p>
        </div>
        <div className="grid w-full gap-[18px]">
          <DefaultInput
            id="email"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            style="!w-full"
            value={email}
            setValue={(val: string) => {
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
          >
            Reset Password
          </DefaultButton>
        </div>
        <p className="text-grey200 text-[16px] mt-[1.1vh] text-center">
          Remember your password? {" "}
          <span
            className="text-red font-medium cursor-pointer hover:text-deepRed"
            onClick={() => navigate("/")}
            role="link"
            tabIndex={0}
          >
            Sign In
          </span>
        </p>
      </form>
    </LoginLayout>
  );
};

export default ForgotPassword;