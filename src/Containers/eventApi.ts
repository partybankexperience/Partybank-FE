import { apiCall } from "../utils/axiosFormat";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Add more fields as needed
}

const createEvent = async (
  name: string,
  description: string,
  bannerImage: string,
  tags: any[],
  phone: string,
  category: string,
  seriesId?: string // optional
): Promise<any> => {
  const payload: Record<string, any> = {
    name,
    description,
    bannerImage,
    tags,
    contactPhone:phone,
    category,
  };

  if (seriesId) {
    payload.seriesId = seriesId;
  }

  const response = await apiCall({
    name: "createEvent",
    data: payload,
  });

  return response;
};
const getEvents=async (): Promise<any> =>{
  const response = await apiCall({
    name: "getEvents",
    alert: false
  });
  return response;
}

const createTag = async (name: string,description:string): Promise<any> =>{
  const payload = {
    name,
    description
  }
  const response = await apiCall({
    name: "createTag",
    data: payload,
    alert: false
  });
  return response;
}

const getTags = async (): Promise<any> =>{
  const response = await apiCall({
    name: "getTags",
    alert: false
  });
  return response;
}
const getEventsById =async (id: string): Promise<any> =>{
  const response = await apiCall({
    name: "getEventsById",
    urlExtra: `/${id}`,
    alert: false
  });
  return response;
}
const getScheduleandLocation = async (id:string,eventType: string,startDate:string,startTime:string,endTime:string,isLocationTBA:boolean,venueName?:string,address?: Address,endDate?:string): Promise<any> => {
  const normalizeAddress = (addr?: Partial<Address>): Address => ({
    country: addr?.country || "N/A",
    state: addr?.state || "N/A",
    city: addr?.city || "N/A",
    street: addr?.street || "N/A",
    postalCode: addr?.postalCode || "N/A",
  });
  const response = await apiCall({
    name: "getScheduleandLocation",
    urlExtra: `/${id}/schedule-location`,
    data: {
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      isLocationTBA,
      venueName,
      ...(isLocationTBA && normalizeAddress(address)),
    },
  });
  return response;
}
const editEvent = async (
  id: string,
  name: string,
  description: string,
  bannerImage: string,
  tags: any[],
  phone: string,
  category: string,
  seriesId?: string
): Promise<any> => {
  const payload: Record<string, any> = {
    name,
    description,
    bannerImage,
    tags,
    phone,
    category,
  };

  if (seriesId) {
    payload.seriesId = seriesId;
  }

  const response = await apiCall({
    name: "editEvent",
    urlExtra: `/${id}`,
    data: payload,
  });

  return response;
};

const deleteEvent = async (id: string): Promise<any> => {
  const response = await apiCall({
    name: "deleteEvent",
    urlExtra: `/${id}`,
  });
  return response;
};

const duplicateEvent = async (id: string,includeTicket:boolean,includeTags:boolean,name:string): Promise<any> => {
  const response = await apiCall({
    name: "duplicateEvent",
    urlExtra: `/${id}/duplicate`,
    params: {
      includeTicket,
      includeTags
    },
    data: {
      name
    }
  });
  return response;
};

const accessibility = async (id: string, wheelchairAccessible:boolean,parkingAvailable:boolean,attendeesCoverFees:boolean,minAge:string,visibility:'private'|'public'): Promise<any> => {
  const response = await apiCall({
    name: "accessibility",
    urlExtra: `/${id}/accessibility`,
    data: {
     wheelchairAccessible, parkingAvailable, attendeesCoverFees, minAge, visibility
    },
  });
  return response;
};
const publishEvent = async (id: string): Promise<any> => {
  const response = await apiCall({
    name: "publishEvent",
    urlExtra: `/${id}/publish`,
  });
  return response;
};  
const notification = async (id: string, notifyOnTicketSale: boolean): Promise<any> => {
  const response = await apiCall({
    name: "notification",
    urlExtra: `/${id}/notifications`,
    data: {
      notifyOnTicketSale,
    },
  });
  return response;
};
const checkSimilarEvent = async(name: string, date: string): Promise<any> => {
  const response = await apiCall({
    name: "checkSimilarEvent",
    params: {
      name,
      date
    },
    alert: false
  });
  return response;
};

const getEventsBySlug = async (slug: string): Promise<any> => {
  const response = await apiCall({
    name: "getEventsBySlug",
    urlExtra: `/${slug}`,
    alert: false
  });
  return response;
};

export { createEvent, createTag, getTags, getEventsById, getEvents, getScheduleandLocation, editEvent, deleteEvent, duplicateEvent, accessibility, publishEvent, notification, checkSimilarEvent,getEventsBySlug };