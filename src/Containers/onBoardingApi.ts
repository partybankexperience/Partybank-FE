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

const SetProfile=async (fullName:String,businessName:String): Promise<any> => {
    const response = await apiCall({
        name: "setProfile",
        data: {businessName,fullName},
    })
    return response;
}

const SetPin=async (pin:String): Promise<any> => {
    const response = await apiCall({
        name: "setPin",
        data: {pin},
    })
    return response;
}
const CreateSeries=async (name:String,userId:String,description:String,coverImage:String): Promise<any> => {
    const response = await apiCall({
        name: "createSeries",
        data: {name,userId,description,coverImage},
    })
    return response;
}
const LoginUser=async (email: String,password:String): Promise<any> => {
    const response = await apiCall({
        name: "login",
        data: {email,password},
    })
    return response;
}
const LoginWithGoogle=async (): Promise<any> => {
    const response = await apiCall({
        name: "loginWithGoogle",
        // data: {email,password},
    })
    return response;
}
export {LoginWithGoogle,LoginUser,RegisterUser,Verifyotp,SetPassword,SetProfile,SetPin,CreateSeries}