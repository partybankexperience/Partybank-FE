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
    login: {
        url: "/auth/login",
        method: "POST",
        headers,
        auth: false,
    },
    loginWithGoogle: {
        url: "/auth/google",
        method: "GET",
        headers,
        auth: false,
    },
    signUp: {
        url: "/auth/initiate",
        method: "POST",
        headers,
        // auth: true,
    },
    refreshToken: {
        url: "/refresh-token",
        method: "POST",
        headers
    },
    verifyOTP: {
        url: "/auth/verify-otp",
        method: "POST",
        headers,
        // auth: false,
    },
    setPassword: {
        url: "/onboarding/set-password",
        method: "POST",
        headers,
        auth: true,
    },
    setProfile: {
        url: "/onboarding/set-profile",
        method: "POST",
        headers,
        auth: true,
    },
    setPin: {
        url: "/onboarding/set-pin",
        method: "POST",
        headers,
        auth: true,
    },
    createSeries: {
        url: "/series/create",
        method: "POST",
        headers: FileHeaders,
        auth: true,
    },

};
