import { ToastContainer } from "react-toastify";
import { errorAlert, infoAlert, successAlert } from "../../components/alerts/ToastService";
import { apiCall } from "../../utils/axiosFormat";

const Login = () => {
  function onClick() {
    infoAlert("Heads up", "You have unsaved changes.");
    
  }

  function apiTesting() {
    try {
      const res= apiCall({
        name: "posts",
        action: (): any => (["skip"]),
      })
    } catch (error:any) {
      console.log(error)
    }
  }
  return (
    <div className='text-vividPurple text-2xl grid'>
<ToastContainer/>
<button onClick={onClick}>Click me</button>
<button onClick={apiTesting}>Api testing</button>
      <p>
      Login
      </p>
      </div>
  )
}

export default Login
