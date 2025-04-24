import { FcGoogle } from "react-icons/fc"
import DefaultButton from "../../components/buttons/DefaultButton"
import DefaultInput from "../../components/inputs/DefaultInput"
import LoginLayout from "../../components/layouts/LoginLayout"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()
  return (
    <LoginLayout>
      <div className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit ">
          <div className="grid gap-[10px] text-center md:text-left">
            <h1 className="text-black text-[24px] md:text-[36px] font-bold">
            Create an Account
            </h1>
            <p className="text-lightGrey text-[20px]">
            Let’s sign up quickly to get stated.
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
          </div>
          <div className=" grid gap-[10px]">
            <DefaultButton
              variant="primary"
              size="normal"
              type="default"
              className="w-full"
              onClick={() => navigate('/emailVerification')}
            >
              Sign Up
            </DefaultButton>
            <DefaultButton
              variant="secondary"
              size="normal"
              className="w-full"
              icon={<FcGoogle />}
              type="icon-left"
            >
              Sign Up with Google
            </DefaultButton>
          </div>
          <p className="text-grey200 text-[16px]  mt-[1.1vh] text-center">
          Already have an account?{" "}
            <span className="text-red font-medium cursor-pointer hover:text-deepRed" onClick={()=>navigate('/')} role='link' tabIndex={0}>Sign In</span>
          </p>
        </div>
    </LoginLayout>
  )
}

export default Signup