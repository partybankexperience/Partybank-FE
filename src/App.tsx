import { Route, Routes } from "react-router"
import Login from "./pages/onboarding/Login"
import Signup from "./pages/onboarding/Signup"
import PrivateRoute from "./utils/privateRoute"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={
        <PrivateRoute>
          <Signup />
        </PrivateRoute>} />
    </Routes> 
   </>
  )
}

export default App