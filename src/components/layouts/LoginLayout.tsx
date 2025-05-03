import { ReactNode } from "react";
import login from "../../assets/images/Login.png";
import logo from "../../assets/images/pb-logo.png";

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="relative min-h-screen flex">
      <div className="w-full xl:w-[45%] z-10 flex flex-col justify-between px-5 py-8 lg:pl-16 lg:pr-10 relative">
        <img src={logo} alt="PartyBank logo" className="w-26 object-contain" />
        <div className="flex-grow mt-6">{children}</div>
        <footer className="text-sm text-[#A7A5A6] font-[RedHat] text-center mt-24">
          © 2025 <span className="text-[#E91B41] font-bold">PartyBank</span>.
          All rights reserved.
        </footer>
      </div>

      <div className="hidden xl:block fixed top-0 right-0 w-[55%] h-screen z-0">
        <img
          src={login}
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginLayout;
