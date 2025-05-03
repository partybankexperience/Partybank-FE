import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { FiCheck } from "react-icons/fi";
import logo from "../../assets/images/logoWhite.svg";
import { Storage } from "../../stores/InAppStorage";
import { infoAlert } from "../alerts/ToastService";

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

  const { completedSteps,markStepComplete,reset  } = useOnboardingStore();
  const hasReset = useRef(false);
  const check=async () => {

    const user = Storage.getItem("user");
// console.log("user", user);
    if (stepParam !== "emailVerification" && !user?.onboardingStep) {
      if (!hasReset.current) {
        console.log("email step - reset and redirect");
        hasReset.current = true;
        reset();
        infoAlert("Auth invalid", "Please sign up/login in first");
        return navigate("/signup", {
          replace: true,
          state: {
            toast: {
              type: "info",
              title: "Auth invalid",
              message: "Please sign up/login first",
            },
          },
        });
      }
      return; // Prevent navigating multiple times
    }

    const correctStep = user?.onboardingStep;
    const correctStepIndex = steps.findIndex((s) => s.path === correctStep);
    const currentStepIndex = steps.findIndex((s) => s.path === stepParam);
    // Mark steps as completed if not already marked
    for (let i = 0; i < currentStepIndex; i++) {
      const step = steps[i];
      if (!completedSteps.includes(step.path)) {
      console.log("completed step");

        markStepComplete(step.path);  // Mark previous steps as completed
      }
    }

    if (correctStep &&
      correctStepIndex !== -1 &&currentStepIndex !== correctStepIndex ) {
      console.log("Incorrect step");
      // If they're not on the correct step, redirect them
      navigate(`/${correctStep}`, { replace: true });
    }
  }
  useEffect(() => {
    check()
  }, [stepParam]);

  const stepParamIndex = steps.findIndex((s) => s.path === stepParam);


  return (
    <div className="md:p-[20px] md:px-[5vw] md:py-[9.2vh] flex flex-col md:grid md:grid-cols-[1fr_2.5fr] md:gap-[20px] lg:gap-[80px] min-h-screen">
      <div className="rounded-[22px] h-fit bg-white md:bg-black md:h-full  p-[2vw]">
        <img src={logo} alt="Partybank logo" className="hidden md:block" />
        <nav className="my-[2vw] md:mb-0 flex justify-between h-fit md:grid gap-[3vh]">
          {steps.map((step, index) => {
            const isActive = index === stepParamIndex;
            const isComplete = completedSteps.includes(step.path);
            return (
              <div
                key={step.path}
                // onClick={() => canNavigateTo(index) && navigate(`/${step.path}`)}
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
