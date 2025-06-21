import {  MouseEventHandler } from "react";

export type DefaultButtonType = {
    handleClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export type endpointTypes = {
    url: string;
    method: string;
    headers?: Record<string, string>;
    auth?: boolean;
    urlExtra?: string;
};

export type endPointlistTypes = {
    signUp: endpointTypes;
    verifyOTP: endpointTypes;
    setPassword: endpointTypes;
    setProfile: endpointTypes;
    setPin: endpointTypes;
    createSeries: endpointTypes;
    login: endpointTypes;
    loginWithGoogle: endpointTypes;
    refreshToken: endpointTypes;
    forgotPassword: endpointTypes;
    forgotPasswordOTP: endpointTypes;
    resetPassword: endpointTypes;
    getSeries: endpointTypes;
    getSeriesById: endpointTypes;
    updateSeries: endpointTypes;
    deleteSeries: endpointTypes;
    createEvent: endpointTypes;
    createTag: endpointTypes;
    getTags: endpointTypes;
    createTicket: endpointTypes;
    deleteTicket: endpointTypes;
    getEventsById: endpointTypes;
    getEvents: endpointTypes;
    getScheduleandLocation: endpointTypes;
    editEvent: endpointTypes;
    deleteEvent: endpointTypes;
    duplicateEvent: endpointTypes;
    notification: endpointTypes;
    // duplicateTicket: endpointTypes;
    accessibility: endpointTypes;
    publishEvent: endpointTypes;
    editTicket: endpointTypes;
    checkSimilarEvent:endpointTypes;
    createTicketByEventId:endpointTypes;
    getEventsBySlug: endpointTypes;
    getSeriesBySlug: endpointTypes;
};

export type urlPropTypes = {
    urlExtra?: string;
    name: string;
    data?: any;
    params?: any;
    action?: (data: any) => any;
    alert?: boolean;
};
