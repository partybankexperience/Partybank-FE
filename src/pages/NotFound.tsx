
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DefaultButton from "../components/buttons/DefaultButton";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { Storage } from "../stores/InAppStorage";
import logo from "../assets/images/pb-logo 1.svg";

const NotFound = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Storage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-[5%] text-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-0 right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-lg mx-auto">
                {/* Logo */}
                <div className="mb-8 animate-bounce">
                    <img src={logo} alt="PartyBank Logo" className="h-[80px] mx-auto drop-shadow-lg" />
                </div>

                {/* Error Icon */}
                <div className="mb-6">
                    {/* <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                        <FaExclamationTriangle className="text-3xl text-orange-500" />
                    </div> */}
                </div>

                {/* 404 Number */}
                {/* <div className="mb-4">
                    <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 leading-none">
                        404
                    </h1>
                </div>
 */}
                {/* Main heading */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    Oops! Page Not Found
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    The page you're looking for seems to have gone to a party without us. 
                    <br className="hidden sm:block" />
                    Let's get you back on track!
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <DefaultButton
                        type="icon-left"
                        variant="primary"
                        icon={<FaHome />}
                        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
                        className="!w-full sm:!w-fit px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                    </DefaultButton>
                    <DefaultButton
                        type="default"
                        variant="tertiary"
                        onClick={() => navigate(-1)}
                        className="!w-full sm:!w-fit px-8 py-3 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Go Back
                    </DefaultButton>
                </div>

                {/* Additional help text */}
                <div className="text-sm text-gray-500">
                    <p>If you believe this is an error, please contact support.</p>
                </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-4 w-4 h-4 bg-primary rounded-full animate-ping opacity-20"></div>
            <div className="absolute bottom-32 right-8 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-30 animation-delay-1000"></div>
            <div className="absolute top-1/2 left-8 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-25 animation-delay-2000"></div>
        </div>
    );
};

export default NotFound;
