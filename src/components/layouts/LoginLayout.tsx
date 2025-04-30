import login from "../../assets/images/Login.png";
import logo from "../../assets/images/pb-logo 1.svg";
import avatar from "../../assets/images/avatar.png";

const LoginLayout = ({children}:any) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-[3fr_4fr]">
      <div className="px-0 py-[12px] md:py-[5vh] grid grid-rows-[auto_1fr_auto] h-screen">
      <div className="relative w-full mb-6">
        <div className="flex  items-center relative z-10">
          <div className="left-0 top-1/2 -translate-y-1/2 h-[0.125rem] w-2/5 lg:w-[5rem] bg-gray-300" />
          <div className="w-[0.5rem] h-[0.5rem] bg-gray-400 rounded-full" />
          <img src={logo} alt="Party bank logo" className="h-[40px] ml-[0.5rem]" />
        </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="px-[20px] md:px-[50px] lg:px-[100px]  py-[12px] md:py-[5vh] grid grid-rows-[auto_1fr_auto] h-screen">
            {children}
            <footer className="text-[14px] text-grey200 text-center">© 2025 PartyBank. All rights reserved.</footer>
          </div>
        </div>
      </div>
      <div className="hidden relative md:block h-full max-h-screen">
        <img src={login} alt="" className="object-cover  min-h-screen" />
        <div className="absolute bottom-10 left-10 text-white space-y-4 max-w-[80%]">
          <h2 className="text-2xl font-bold">Create and Manage your own Event</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-4">
              <div className="flex items-center -space-x-4">
                <img src={avatar} alt="User Image"className="w-12 h-12 rounded-full object-cover border border-black"/>
                <img src={avatar} alt="User Image"className="w-12 h-12 rounded-full object-cover border border-black"/>
                <img src={avatar} alt="User Image"className="w-12 h-12 rounded-full object-cover border border-black"/>
              </div>
            </div>
            <p className="text-sm text-white/80">Trusted by over 10,000+ buyers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginLayout