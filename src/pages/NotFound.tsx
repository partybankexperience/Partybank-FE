import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DefaultButton from "../components/buttons/DefaultButton";
import { FaHome } from "react-icons/fa";
import { Storage } from "../stores/InAppStorage";
import logo from "../assets/images/logoWhite.svg";

const NotFound = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Storage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-[5%] text-center">
            <img src={logo} alt="PartyBank Logo" className="h-[60px] mb-6" />
            <h1 className="font-extrabold text-3xl text-center">Oops!</h1>
            <p className="mb-[25px] text-center">We can't seem to find the page you are looking for.</p>

            <div className="flex flex-col sm:flex-row gap-[15px] justify-center">
                    <DefaultButton
                        type="icon-left"
                        variant="primary"
                        icon={<FaHome />}
                        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
                        className="!w-full sm:!w-fit"
                    >
                        {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                    </DefaultButton>
                    <DefaultButton
                        type="default"
                        variant="tertiary"
                        onClick={() => navigate(-1)}
                        className="!w-full sm:!w-fit border"
                    >
                        Go Back
                    </DefaultButton>
                </div>
        </div>
    );
};

export default NotFound;