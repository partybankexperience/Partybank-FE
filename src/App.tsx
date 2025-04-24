import { Route, Routes } from "react-router"
import Login from "./Pages/onboarding/Login"
import Signup from "./Pages/onboarding/Signup"
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