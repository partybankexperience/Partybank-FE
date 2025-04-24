import { Route, Routes } from "react-router"
import Login from "./pages/onboarding/Login"
import Signup from "./pages/onboarding/Signup"
import PrivateRoute from "./utils/privateRoute"
import EmailVerification from "./pages/onboarding/EmailVerification"
import OnboardingLayout from "./components/layouts/SignupLayout"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/emailVerification" element={<EmailVerification />} />
        <Route path="/passwordSetup" element={<EmailVerification />} />
        <Route path="/profileInformation" element={<EmailVerification />} />
        <Route path="/pinSetup" element={<EmailVerification />} />
        <Route path="/createEventSeries" element={<EmailVerification />} /> */}
        <Route path="/:step" element={<OnboardingLayout />} />
    </Routes> 
   </>
  )
}

export default App