import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { FiCheck } from "react-icons/fi";
import logo from "../../assets/images/logoWhite.svg";

const steps = [
  { path: "emailVerification", label: "Email Verification" },
  { path: "passwordSetup", label: "Password Setup" },
  { path: "profileInformation", label: "Profile Information" },
  { path: "pinSetup", label: "PIN Setup" },
  { path: "createEventSeries", label: "Create Event" },
];

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const stepParam = location.pathname.split("/").pop();
  const currentStepIndex = steps.findIndex((s) => s.path === stepParam);

  useEffect(() => {
    if (currentStepIndex === -1) navigate("/emailVerification", { replace: true });
  }, [currentStepIndex, navigate]);

  const { completedSteps } = useOnboardingStore();

  const canNavigateTo = (targetIndex: number) =>
    targetIndex <= currentStepIndex || completedSteps.includes(steps[targetIndex].path);

  return (
    <div className="md:p-[20px] md:px-[5vw] md:py-[9.2vh] flex flex-col md:grid md:grid-cols-[1fr_2.5fr] md:gap-[20px] lg:gap-[80px] min-h-screen">
      <div className="rounded-[22px] h-fit bg-white md:bg-black md:h-full  p-[2vw]">
        <img src={logo} alt="Partybank logo" className="hidden md:block" />
        <nav className="my-[2vw] md:mb-0 flex justify-between h-fit md:grid gap-[3vh]">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isComplete = completedSteps.includes(step.path);
            return (
              <div
                key={step.path}
                onClick={() => canNavigateTo(index) && navigate(`/${step.path}`)}
                className="flex gap-[15px] items-center mt-[2vw] cursor-pointer"
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                    isComplete ? "bg-green" : "bg-grey200"
                  } ${isActive && "bg-red text-white"}`}
                >
                  <FiCheck className="w-[22px] m-auto text-white text-lg" />
                </div>
                <a
                  className={`hidden md:block text-[20px] font-medium ${
                    isActive ? "text-white" : isComplete ? "text-white" : "text-grey400"
                  }`}
                  tabIndex={0}
                >
                  {step.label}
                </a>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="bg-grey300 md:rounded-[22px] md:h-full p-[2vw] flex flex-col flex-grow">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
