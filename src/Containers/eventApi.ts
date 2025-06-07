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
    phone,
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
const createTicket = async (
  eventId: string,
  name: string,
  category: "single" | "group" | string,
  type: "paid" | "free" | string,
  price: number,
  purchaseLimit: number,
  stock: number,
  soldTarget: number,
  salesStart: string, // ISO format
  salesEnd: string,   // ISO format
  startTime: string,  // "HH:mm"
  endTime: string,    // "HH:mm"
  perks: string[],
  isHidden: boolean,
  isSoldOut: boolean
): Promise<any> => {
  const payload = {
    eventId,
    name,
    category,
    type,
    price,
    purchaseLimit,
    stock,
    soldTarget,
    salesStart,
    salesEnd,
    startTime,
    endTime,
    perks,
    isHidden,
    isSoldOut,
  };

  const response = await apiCall({
    name: "createTicket",
    data: payload,
  });

  return response;
};
const deleteTicket = async (id: string): Promise<any> =>{
  const response = await apiCall({
    name: "deleteTicket",
    urlExtra: `/${id}`
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
const getScheduleandLocation = async (id:string,eventType: string,startDate:string,endDate:string,startTime:string,endTime:string,isLocationTBA:boolean,venueName?:string,address?: Address): Promise<any> => {
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
      address
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

export { createEvent,createTicket,deleteTicket,createTag ,getTags,getEventsById,getEvents,getScheduleandLocation,editEvent}