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
    // Add your endpoint definitions here
    posts:{
        url: "/posts",
        method: "GET",
        headers,
        // auth: true,
    }
};
