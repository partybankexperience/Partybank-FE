import login from "../../assets/images/Login.png";
import logo from "../../assets/images/pb-logo 1.png";

const LoginLayout = ({children}:any) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-[3fr_4fr]">
      <div className="px-[20px] md:px-[50px] lg:px-[100px]  py-[12px] md:py-[5vh] grid grid-rows-[auto_1fr_auto] h-screen">
        <img src={logo} alt="Party bank logo" className="m-auto md:m-0" />
        {children}
        <p className="text-[14px] text-grey200 text-center">© 2025 PartyBank. All rights reserved.</p>
      </div>
      <div className="hidden md:block h-full max-h-screen">
        <img src={login} alt="" className="object-cover  min-h-screen" />
      </div>
    </div>
  )
}

export default LoginLayout