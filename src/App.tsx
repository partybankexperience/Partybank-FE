import { Route, Routes } from "react-router"
import Login from "./pages/onboarding/Login"
import PrivateRoute from "./utils/privateRoute"
import Signup from "./pages/onboarding/Signup"

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