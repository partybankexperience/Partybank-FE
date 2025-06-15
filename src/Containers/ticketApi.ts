import { apiCall } from "../utils/axiosFormat";

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
  isUnlimited: boolean,
  groupSize?: number,
  color?: string
): Promise<any> => {
  const payload = {
    eventId,
    name,
    category,
    type,
    purchaseLimit,
    // stock,
    soldTarget,
    salesStart,
    salesEnd,
    startTime,
    endTime,
    perks,
    isUnlimited,
    ...(category === 'group' &&  { groupSize:groupSize }),
    ...(type === 'paid' &&  { price }),
    ...(!isUnlimited &&  { stock }),
    ...(color && { color }),
  };

  // ...(isLocationTBA && address),
  const response = await apiCall({
    name: "createTicket",
    data: payload,
  });

  return response;
};
const createTicketByEventId = async (
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
  isUnlimited: boolean,
  groupSize?: number,
  color?: string
): Promise<any> => {
  const payload = {
    name,
    category,
    type,
    purchaseLimit,
    // stock,
    soldTarget,
    salesStart,
    salesEnd,
    startTime,
    endTime,
    perks,
    isUnlimited,
    ...(category === 'group' &&  { groupSize:groupSize }),
    ...(type === 'paid' &&  { price }),
    ...(!isUnlimited &&  { stock }),
    ...(color && { color }),
  };

  // ...(isLocationTBA && address),
  const response = await apiCall({
    name: "createTicketByEventId",
    data: payload,
    urlExtra: `/${eventId}/creation/tickets`
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
const editTicket = async (
  id: string, 
  eventId: string,
  name: string, 
  category: "single" | "group" | string, 
  type: "paid" | "free" | string, 
  price: number, 
  purchaseLimit: number, 
  stock: number, 
  soldTarget: number, 
  salesStart: string, 
  salesEnd: string, 
  startTime: string, 
  endTime: string, 
  perks: string[], 
  isUnlimited: boolean,
  groupSize?: number,
  color?: string
): Promise<any> => {
  const payload = {
    eventId,
    name,
    category,
    type,
    purchaseLimit,
    soldTarget,
    salesStart,
    salesEnd,
    startTime,
    endTime,
    perks,
    isUnlimited,
    ...(category === 'group' && { groupSize }),
    ...(type === 'paid' && { price }),
    ...(!isUnlimited && { stock }),
    ...(color && { color }),
  };
  const response = await apiCall({
    name: "editTicket",
    urlExtra: `/${eventId}`,
    data: payload
  });
  return response;
}
export {deleteTicket, createTicket,editTicket,createTicketByEventId};