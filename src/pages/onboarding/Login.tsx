import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FcGoogle } from "react-icons/fc";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { LoginUser, LoginWithGoogle } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";

const Login = () => {
  const [email, setemail] = useState("");
  // const [emailError, setEmailError] = useState('')
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailError) {
      if (emailError && emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    if (passwordError) {
      if (passwordError && passwordRef.current) {
        passwordRef.current.focus();
      }
      return;
    }
    try {
      const res = await LoginUser(email, password);
      Storage.setItem("token", res.accessToken);
      Storage.setItem("user", res.user);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
    // Handle sign-in logic here
  }

  async function handleLoginWithGoogle() {
    // event.preventDefault();
    // Handle Google login logic here
    try {
      await LoginWithGoogle()
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit "
        onSubmit={handleSignIn}
      >
        <div className="grid gap-[10px] text-center md:text-left">
          <h1 className="text-black text-[24px] md:text-[36px] font-bold">
            Login to Your Account
          </h1>
          <p className="text-lightGrey text-[20px]">
            Let’s sign in quickly to continue to your account.
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
            setValue={setemail}
            required
            inputRef={emailRef}
            setExternalError={setEmailError}
            // setExternalError={setEmailError}
          />
          <DefaultInput
            id="password"
            label="Password"
            placeholder="********"
            type="password"
            style="!w-full"
            value={password}
            setValue={setpassword}
            required
            inputRef={passwordRef}
            setExternalError={setPasswordError}
          />
        </div>
        <div className=" grid gap-[10px]">
          <DefaultButton
            variant="primary"
            size="normal"
            type="default"
            className="w-full"
            onClick={() => handleSignIn}
            submitType="submit"
          >
            Sign In
          </DefaultButton>
          <DefaultButton
            variant="secondary"
            size="normal"
            className="w-full"
            icon={<FcGoogle />}
            type="icon-left"
            onClick={() => handleLoginWithGoogle()}
          >
            Sign In with Google
          </DefaultButton>
        </div>
        <p className="text-grey200 text-[16px]  mt-[1.1vh] text-center">
          Don’t have an account?{" "}
          <span
            className="text-red font-medium cursor-pointer hover:text-deepRed"
            onClick={() => navigate("/signup")}
            role="link"
            tabIndex={0}
          >
            Sign Up
          </span>
        </p>
      </form>
    </LoginLayout>
  );
};

export default Login;
