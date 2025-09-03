import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { FiCheck } from 'react-icons/fi';
import logo from '../../assets/images/logoWhite.svg';
import image from '../../assets/images/image.png';
import { Storage } from '../../stores/InAppStorage';
import { infoAlert } from '../alerts/ToastService';
import { ToastContainer } from 'react-toastify';

// UI list (kebab paths for rendering only)
const steps = [
  { path: 'email-verification', label: 'Email Verification' },
  { path: 'password-setup', label: 'Password Setup' },
  { path: 'profile-information', label: 'Profile Information' },
  { path: 'pin-setup', label: 'PIN Setup' },
  { path: 'create-event-series', label: 'Create Series' },
];

// FE step enum (includes FE-only 'emailVerification')
type Step =
  | 'emailVerification'
  | 'passwordSetup'
  | 'profileInformation'
  | 'pinSetup'
  | 'createEventSeries';

const ORDER: Step[] = [
  'emailVerification',
  'passwordSetup',
  'profileInformation',
  'pinSetup',
  'createEventSeries', // optional
];

// Route segment <-> FE enum mappings
const PATH_TO_STEP: Record<string, Step> = {
  'email-verification': 'emailVerification',
  'password-setup': 'passwordSetup',
  'profile-information': 'profileInformation',
  'pin-setup': 'pinSetup',
  'create-event-series': 'createEventSeries',
};
const STEP_TO_PATH: Record<Step, string> = {
  emailVerification: 'email-verification',
  passwordSetup: 'password-setup',
  profileInformation: 'profile-information',
  pinSetup: 'pin-setup',
  createEventSeries: 'create-event-series',
};

// Decide where a user should be routed (skip optional to dashboard)
function targetRouteForUser(user?: { isOnboardingComplete?: boolean; onboardingStep?: Step }) {
  if (!user?.onboardingStep) return '/email-verification';
  if (user.isOnboardingComplete) return '/dashboard';
  if (user.onboardingStep === 'createEventSeries') return '/dashboard'; // optional step skipped
  return `/${STEP_TO_PATH[user.onboardingStep]}`;
}

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const stepParam = location.pathname.split('/').filter(Boolean).pop() || '';

  const { completedSteps, markStepComplete, reset } = useOnboardingStore();
  const hasReset = useRef(false);

  useEffect(() => {
    const user = Storage.getItem('user');

    // If not at email-verification and we have no user/step, kick to signup (once)
    if (stepParam !== 'email-verification' && !user?.onboardingStep) {
      if (!hasReset.current) {
        hasReset.current = true;
        reset();
        infoAlert('Auth invalid', 'Please sign up/login first');
        navigate('/signup', {
          replace: true,
          state: {
            toast: { type: 'info', title: 'Auth invalid', message: 'Please sign up/login first' },
          },
        });
      }
      return;
    }

    // Enforce correct route for this user (handles skipping create-event-series)
    if (user?.onboardingStep) {
      const target = targetRouteForUser(user);
      if (location.pathname !== target) {
        navigate(target, { replace: true });
        return;
      }
    }

    // Mark previous steps complete using FE enum, not kebab paths
    const currentStepEnum: Step | undefined = PATH_TO_STEP[stepParam];
    const currentIdx = currentStepEnum ? ORDER.indexOf(currentStepEnum) : -1;

    if (currentIdx > 0) {
      for (let i = 0; i < currentIdx; i++) {
        const prevStep = ORDER[i];
        if (!completedSteps.includes(prevStep)) {
          markStepComplete(prevStep);
        }
      }
    }
  }, [stepParam, navigate, location.pathname, completedSteps, markStepComplete, reset]);

  const stepParamIndex = steps.findIndex((s) => s.path === stepParam);

  return (
    <>
      <div className="md:p-[20px] md:px-[5vw] md:py-[9.2vh] flex flex-col md:grid md:grid-cols-[1fr_2.5fr] md:gap-[20px] lg:gap-[80px] min-h-screen">
        <div
          className="rounded-[22px] h-fit bg-white md:bg-lightdark md:h-full p-[2vw]"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <img src={logo} alt="Partybank logo" className="hidden md:block h-[50px]" />
          <nav className="my-[2vw] md:mb-0 flex justify-center md:justify-start items-center w-90% h-fit md:grid gap-[1vh]">
            {steps.map((step, index) => {
              const stepEnum = PATH_TO_STEP[step.path]; // convert kebab -> FE enum
              const isActive = index === stepParamIndex;
              const isComplete = completedSteps.includes(stepEnum);
              const isLastStep = index === steps.length - 1;
              const isLineWhite = isComplete || isActive;

              return (
                <div key={step.path} className="flex gap-[15px] cursor-pointer">
                  <div className="flex pt-1 sm:flex-row md:flex-col items-center gap-[5px]">
                    <div
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                        isComplete ? 'bg-green' : 'bg-grey200'
                      } ${isActive && 'bg-red text-white'}`}
                    >
                      <FiCheck className="w-[22px] m-auto text-white text-lg" />
                    </div>
                    {!isLastStep && (
                      <div
                        className={`w-[60px] sm:w-[80px] h-[2px] sm:h-[2px] md:w-[2px] md:h-[40px] ${
                          isLineWhite ? 'bg-black md:bg-white' : 'bg-grey200'
                        } sm:ml-0 md:ml-[0]`}
                      />
                    )}
                  </div>
                  <a
                    className={`hidden md:block text-[20px] font-medium ${
                      isActive ? 'text-white' : isComplete ? 'text-white' : 'text-grey400'
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
      <ToastContainer />
    </>
  );
};

export default OnboardingLayout;
