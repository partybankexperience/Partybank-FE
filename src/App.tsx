import { Route, Routes } from "react-router"
import Login from "./Pages/onboarding/Login"
import PrivateRoute from "./utils/Privateroute"
import Signup from "./Pages/onboarding/Signup"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<PrivateRoute><Signup />
        </PrivateRoute>} />
    </Routes> 
   </>
  )
}

export default App