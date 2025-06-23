// import { FcGoogle } from "react-icons/fc";
import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { RegisterUser } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { errorAlert } from "../../components/alerts/ToastService";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { reset } = useOnboardingStore();

  const emailRef = useRef<any>(null);
  const location = useLocation();

  useEffect(() => {
    const toast = location.state?.toast;
    if (toast) {
      errorAlert(toast.title, toast.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    reset();
    Storage.clearItem();
  }, []);

  async function handleRegisterUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailError) {
      if (emailError && emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    try {
      await RegisterUser(email);
      navigate("/emailVerification");
      Storage.setItem("email", email);
      console.log("User registered successfully");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit "
        onSubmit={handleRegisterUser}
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className="text-black text-3xl font-semibold">
            Create an Account
          </h1>
          <p className="text-lightGrey font-normal text-sm">
            Let’s sign up quickly to get stated.
          </p>
        </div>
        <div className="grid w-full gap-[18px]">
          <DefaultInput
            id="signupEmail"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            style="!w-full"
            value={email}
            setValue={setemail}
            required
            inputRef={emailRef}
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
            Sign Up
          </DefaultButton>
          {/* <DefaultButton
            variant="secondary"
            size="normal"
            className="w-full"
            icon={<FcGoogle />}
            type="icon-left"
          >
            Sign Up with Google
          </DefaultButton> */}
        </div>
        <p className="text-grey200 text-[14px]  mt-[0.5vh] text-center">
          Already have an account?{" "}
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

export default Signup;
