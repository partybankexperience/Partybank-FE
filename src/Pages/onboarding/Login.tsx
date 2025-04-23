import { ToastContainer } from "react-toastify";
import { infoAlert } from "../../components/alerts/ToastService";
import { apiCall } from "../../utils/axiosFormat";
import DefaultButton from "../../components/buttons/DefaultButton";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import DefaultInput from "../../components/inputs/DefaultInput";

const Login = () => {
  function onClick() {
    infoAlert("Heads up", "You have unsaved changes.");
  }

  function apiTesting() {
    try {
      const res = apiCall({
        name: "posts",
        action: (): any => ["skip"],
      });
      console.log(res);
    } catch (error: any) {
      console.log(error);
    }
  }
  return (
    <div className="text-vividPurple text-2xl grid gap-2">
      <ToastContainer />
      <button onClick={onClick}>Click me</button>
      <button onClick={apiTesting}>Api testing</button>
      <p>Login</p>

      <DefaultButton variant="primary" type="icon-left" icon={<FaArrowLeft />}>
        Back
      </DefaultButton>
      <DefaultButton
        variant="primary"
        size="small"
        icon={<span>Icon</span>}
        onClick={onClick}
        disabled={true}
      >
        Login
      </DefaultButton>
      <DefaultButton
        variant="tertiary"
        icon={<span>Icon</span>}
        onClick={onClick}
        disabled={true}
      >
        Login
      </DefaultButton>
      <DefaultButton
        variant="black"
        icon={<span>Icon</span>}
        onClick={onClick}
        disabled={true}
      >
        Login
      </DefaultButton>
      <DefaultButton
        variant="secondary"
        icon={<span>Icon</span>}
        onClick={onClick}
        disabled={true}
      >
        Login
      </DefaultButton>
      <DefaultInput id="name" label="Name" />
      <DefaultInput
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
      />

      <DefaultInput id="email" type="email" label="Email" leftContent="@" />

      <DefaultInput id="currency" label="Amount" rightContent="CAD" />

      <DefaultInput
        id="country"
        label="Country"
        showDropdown
        dropdownOptions={["Canada", "USA", "UK"]}
      />
      <DefaultInput
        id="username"
        label="Username"
        placeholder="Enter your username"
        helperText="Your unique ID"
        helperLink="Learn more"
        leftContent={<FaUser />}
        // rightContent="@example.com"
        required
      />
    </div>
  );
};

export default Login;
