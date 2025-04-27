import { FcGoogle } from "react-icons/fc"
import DefaultButton from "../../components/buttons/DefaultButton"
import DefaultInput from "../../components/inputs/DefaultInput"
import LoginLayout from "../../components/layouts/LoginLayout"
import { useNavigate } from "react-router"
import { useRef, useState } from "react"
import { RegisterUser } from "../../Containers/onBoardingApi"
import { ToastContainer } from "react-toastify"
import { Storage } from "../../stores/InAppStorage"

const Signup = () => {
  const navigate = useNavigate()
  const [email, setemail] = useState('')
  const [emailError, setEmailError] = useState(false);
  
  const emailRef = useRef<any>(null);

  async function handleRegisterUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(email,'the email')
    // Handle registration logic here
    if (emailError) {
      if (emailError && emailRef.current) {
        emailRef.current.focus();
      }
      return;
    }
    try {
      await RegisterUser(email)
      navigate('/emailVerification');
      Storage.setItem('email', email)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <LoginLayout>
      <form className="grid mt-[2vh] md:mt-[4vh] gap-[3vh] h-fit " onSubmit={handleRegisterUser}>
      <ToastContainer/>
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
              value={email}
              setValue={setemail}
              required
              inputRef={emailRef}
          setExternalError={setEmailError}
            />
          </div>
          <div className=" grid gap-[10px]">
            <DefaultButton
              variant="primary"
              size="normal"
              type="default"
              className="w-full"
              submitType="submit"
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
        </form>
    </LoginLayout>
  )
}

export default Signup