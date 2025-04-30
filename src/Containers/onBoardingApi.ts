import { apiCall } from "../utils/axiosFormat";

const RegisterUser=async (email: String): Promise<any> => {
    const response = await apiCall({
        name: "signUp",
        data: {
            email
        },
        // action: (): any => (["skip"]),
    })
    return response;
}
const Verifyotp=async (email: String,otp:String): Promise<any> => {

    const response = await apiCall({
        name: "verifyOTP",
        data: {
            email,
            otp
        },
        // action: (): any => (["skip"]),
    })
    return response;
}

// setPassword
const SetPassword=async (confirmPassword:String,password:String): Promise<any> => {
    const response = await apiCall({
        name: "setPassword",
        data: {password,confirmPassword},
    })
    return response;
}

export {RegisterUser,Verifyotp,SetPassword}