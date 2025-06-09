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
        url: "/auth/refresh-token",
        method: "POST",
        headers,
        auth:false
    },
    forgotPassword: {
        url: "/reset-password/initiate",
        method: "POST",
        headers,
        auth:false
    },
    forgotPasswordOTP: {
        url: "/reset-password/verify",
        method: "POST",
        headers,
        auth:false
    },
    resetPassword: {
        url: "/reset-password/submit",
        method: "POST",
        headers,
        auth:false
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
        url: "/series",
        method: "POST",
        headers,
        auth: true,
    },
    getSeries: {
        url: "/series",
        method: "GET",
        headers,
        auth: true,
    },
    getSeriesById: {
        url: "/series",
        method: "GET",
        headers,
        auth: true,
    },
    updateSeries: {
        url: "/series",
        method: "PATCH",
        headers,
        auth: true,
    },
    deleteSeries: {
        url: "/series",
        method: "DELETE",
        headers,
        auth: true,
    },
    //Events
    createEvent: {
        url: "/events",
        method: "POST",
        headers,
        auth: true,
    },
    getEvents: {
        url: "/events",
        method: "GET",
        headers,
        auth: true,
    },
    createTag:{
        url: "/tags",
        method: "POST",
        headers,
        auth: true,
    },
    getTags:{
        url: "/tags",
        method: "GET",
        headers,
        auth: true,
    },
    createTicket:{
        url: "/tickets",
        method: "POST",
        headers,
        auth: true,
    },
    deleteTicket:{
        url: "/tickets",
        method: "DELETE",
        headers,
        auth: true,
    },
    getEventsById: {
        url: "/events",
        method: "GET",
        headers,
        auth: true,
    },
    getScheduleandLocation: {
        url: "/events",
        method: "PATCH",
        headers,
        auth: true,
    },
    editEvent: {
        url: "/events",
        method: "PATCH",
        headers,
        auth: true,
    },
    deleteEvent: {
        url: "/events",
        method: "DELETE",
        headers,
        auth: true,
    },
    duplicateEvent: {
        url: "/events",
        method: "POST",
        headers,
        auth: true,
    },
    accessibility: {
        url: "/events",
        method: "PATCH",
        headers,
        auth: true,
    },
    notification: {
        url: "/events",
        method: "PATCH",
        headers,
        auth: true,
    },
    publishEvent: {
        url: "/events",
        method: "PATCH",
        headers,
        auth: true,
    },
    editTicket: {
        url: "/tickets",
        method: "PATCH",
        headers,
        auth: true,
    }
};