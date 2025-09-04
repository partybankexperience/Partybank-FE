import { apiCall } from '../utils/axiosFormat';

const RegisterUser = async (email: string): Promise<any> => {
  const response = await apiCall({
    name: 'signUp',
    data: {
      email,
    },
    // action: (): any => (["skip"]),
  });
  return response;
};
const Verifyotp = async (email: string, otp: string): Promise<any> => {
  const response = await apiCall({
    name: 'verifyOTP',
    data: {
      email,
      otp,
    },
    // action: (): any => (["skip"]),
  });
  return response;
};

// setPassword
const SetPassword = async (confirmPassword: string, password: string): Promise<any> => {
  const response = await apiCall({
    name: 'setPassword',
    data: { password, confirmPassword },
  });
  return response;
};

const SetProfile = async (fullName: string, businessName: string, phone: string): Promise<any> => {
  const response = await apiCall({
    name: 'setProfile',
    data: { businessName, fullName, phone },
  });
  return response;
};

const SetPin = async (pin: string): Promise<any> => {
  const response = await apiCall({
    name: 'setPin',
    data: { pin },
  });
  return response;
};
const CreateSeries = async (
  name: string,
  userId: string,
  description: string,
  coverImage: string,
): Promise<any> => {
  const response = await apiCall({
    name: 'createSeries',
    data: { name, userId, description, coverImage },
  });
  return response;
};
const LoginUser = async (email: string, password: string): Promise<any> => {
  const response = await apiCall({
    name: 'login',
    data: { email, password },
  });
  return response;
};
const LoginWithGoogle = async (): Promise<any> => {
  const response = await apiCall({
    name: 'loginWithGoogle',
    // data: {email,password},
  });
  return response;
};
const refreshToken = async (): Promise<any> => {
  const response = await apiCall({
    name: 'refreshToken',
    // data: {email,password},
  });
  return response;
};
const forgotPassword = async (email: string): Promise<any> => {
  const response = await apiCall({
    name: 'forgotPassword',
    data: { email },
  });
  return response;
};
const forgotPasswordConfirmOTP = async (email: string, otp: string): Promise<any> => {
  const response = await apiCall({
    name: 'forgotPasswordOTP',
    data: { email, otp },
  });
  return response;
};
const resetPassword = async (
  email: string,
  password: string,
  confirmPassword: string,
): Promise<any> => {
  const response = await apiCall({
    name: 'resetPassword',
    data: { email, password, confirmPassword },
  });
  return response;
};
const resendOTP = async (email: string,purpose:"signup"|"password"): Promise<any> => {
  const response = await apiCall({
    name: 'resendOTP',
    data: { email,purpose },
  });
  return response;
};
export {
  LoginWithGoogle,
  LoginUser,
  RegisterUser,
  Verifyotp,
  SetPassword,
  SetProfile,
  SetPin,
  CreateSeries,
  refreshToken,
  forgotPassword,
  forgotPasswordConfirmOTP,
  resetPassword,
  resendOTP,
};
