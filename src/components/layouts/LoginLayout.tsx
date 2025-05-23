import { ReactNode } from "react";
import login from "../../assets/images/Login.png";
import logo from "../../assets/images/pb-logo.png";
import { ToastContainer } from "react-toastify";

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="relative min-h-screen flex">
      <ToastContainer/>

      <div className="w-full xl:w-[45%] z-10 flex flex-col gap-2 px-5 py-8 lg:px-10  relative">
        <img src={logo} alt="PartyBank logo" className="w-26 object-contain" />
        <div className="flex-grow mt-6">{children}</div>
        <footer className="text-sm text-grey200 font-[RedHat] text-center ">
          © 2025 <span className="text-primary font-bold">PartyBank</span>.
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
