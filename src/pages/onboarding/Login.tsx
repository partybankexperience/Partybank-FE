import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FcGoogle } from "react-icons/fc";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useNavigate, Link } from "react-router-dom";
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
      await LoginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <LoginLayout>
      <form
        className="grid mt-[2vh] md:mt-[2vh] gap-[3vh] h-fit w-full "
        onSubmit={handleSignIn}
      >
        <div className="flex flex-col gap-[6px] text-center md:text-left">
          <h1 className="font-[RedHat] text-3xl font-semibold">
            Login to your account
          </h1>
          <p className="font-[RedHat] text-[#918F90] font-normal text-sm">
            Let’s sign in quickly to continue to your account.
          </p>
        </div>
        <div className="grid w-full gap-[12px] mt-4">
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
          <div>
          
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
            classname="!mb-0 "
          />
          <div className="text-right m-0 ">
              <span
                className="text-[14px] text-red cursor-pointer hover:underline"
                onClick={() => navigate('/forgot-password')}
                role="link"
                tabIndex={0}
              >
                Forgot password?
              </span>
            </div>
          </div>
        </div>

        {/* <div className="flex items-end justify-end">
          <Link
            to=""
            className="-mt-4 font-[RedHat] text-[#E91B41] text-sm font-light"
          >
            Forgot password?
          </Link>
        </div> */}
        <div className="mt-4 grid gap-[10px]">
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
            Sign in with Google
          </DefaultButton>
        </div>
        <p className="text-[#A7A5A6] font-[RedHat] text-[14px]  mt-[0.5vh] text-center">
          Don’t have an account?{"  "}
          <span
            className="text-red cursor-pointer font-bold hover:text-deepRed"
            onClick={() => navigate("/signup")}
            role="link"
            tabIndex={0}
          >
            Sign up
          </span>
        </p>
      </form>
    </LoginLayout>
  );
};

export default Login;
