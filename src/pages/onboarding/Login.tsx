import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FcGoogle } from "react-icons/fc";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LoginUser, LoginWithGoogle } from "../../Containers/onBoardingApi";
import { Storage } from "../../stores/InAppStorage";
import { errorAlert } from "../../components/alerts/ToastService";

const Login = () => {
  const [email, setemail] = useState("");
  // const [emailError, setEmailError] = useState('')
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const [isGoogleLoading, setisGoogleLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(false);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check both location.state and URL parameters for notAuthenticated
    const urlParams = new URLSearchParams(location.search);
    const isNotAuthenticated = location.state === 'notAuthenticated' || urlParams.get('state') === 'notAuthenticated';

    if (isNotAuthenticated) {
      console.log('User was redirected due to not being authenticated.');
      // Show notification immediately
      errorAlert("Not Authenticated", "You need to be logged in to access this page.");
      // Clean up URL after showing notification
      const timer = setTimeout(() => {
        navigate("/", { replace: true, state: null });
      }, 2000); // Give time for user to read the notification

      return () => clearTimeout(timer);
    }
  }, [location.state, location.search, navigate]);

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
    setisLoading(true);
      const res = await LoginUser(email, password);
      Storage.setItem("token", res.accessToken);
      Storage.setItem("user", res.user);
      console.log(res, "Login Response");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }

    // Handle sign-in logic here
  }

  async function handleLoginWithGoogle() {
    // event.preventDefault();
    // Handle Google login logic here
    setisGoogleLoading(true);

    try {
      await LoginWithGoogle();
    } catch (error) {
      console.log(error);
    } finally {
      setisGoogleLoading(false);
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
            id="loginEmail"
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
            id="loginPassword"
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
              <a
                className="text-[14px] text-red cursor-pointer hover:underline"
                onClick={() => navigate('/forgot-password')}
                role="link"
                tabIndex={0}
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-[10px]">
          <DefaultButton
            variant="primary"
            size="normal"
            type="default"
            className="w-full"
            onClick={() => handleSignIn}
            submitType="submit"
            isLoading={isLoading}
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
            isLoading={isGoogleLoading}
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