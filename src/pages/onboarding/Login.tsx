import DefaultButton from "../../components/buttons/DefaultButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { FcGoogle } from "react-icons/fc";
import LoginLayout from "../../components/layouts/LoginLayout";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  return (
      <LoginLayout>

        <div className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit ">
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
            />
            <DefaultInput
              id="password"
              label="Password"
              placeholder="********"
              type="password"
              style="!w-full"
            />
          </div>
          <div className=" grid gap-[10px]">
            <DefaultButton
              variant="primary"
              size="normal"
              type="default"
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Sign In
            </DefaultButton>
            <DefaultButton
              variant="secondary"
              size="normal"
              className="w-full"
              icon={<FcGoogle />}
              type="icon-left"
            >
              Sign In with Google
            </DefaultButton>
          </div>
          <p className="text-grey200 text-[16px]  mt-[1.1vh] text-center">
            Don’t have an account?{" "}
            <span className="text-red font-medium cursor-pointer hover:text-deepRed" onClick={()=>navigate('/signup')} role='link' tabIndex={0}>Sign Up</span>
          </p>
        </div>
      </LoginLayout>
      
  );
};

export default Login;
