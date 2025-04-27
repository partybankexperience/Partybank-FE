import { endPointlistTypes } from "./types";

// API ENDPOINT DOCUMENTATION
const headers = {
    'Content-Type': 'application/json',
    crossDomain: 'true',
};

const FileHeaders = {
    'Content-Type': 'multipart/form-data',
    crossDomain: 'true',
};

export const endPoints: endPointlistTypes = {
    // onboarding
    signUp: {
        url: "/auth/initiate",
        method: "POST",
        headers,
        // auth: true,
    },
    verifyOTP: {
        url: "/auth/verify-otp",
        method: "POST",
        headers,
        // auth: false,
    },
    
};
