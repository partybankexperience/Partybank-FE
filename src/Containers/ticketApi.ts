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
  isHidden: boolean,
  isSoldOut: boolean,
  isUnlimited: boolean,
  numberofPeople?: number,
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
    isHidden,
    isSoldOut,
    isUnlimited,
    ...(category === 'group' &&  { numberofPeople }),
    ...(type === 'paid' &&  { price }),
    ...(isUnlimited &&  { stock }),
  };

  // ...(isLocationTBA && address),
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
const editTicket = async (id: string, name: string, category: "single" | "group" | string, type: "paid" | "free" | string, price: number, purchaseLimit: number, stock: number, sold: number, salesStart: string, salesEnd: string, startTime: string, endTime: string, perks: string[], isHidden: boolean, isSoldOut: boolean, eventId: string): Promise<any> => {
  const payload = {
    name,
    category,
    type,
    price,
    purchaseLimit,
    stock,
    sold,
    salesStart,
    salesEnd,
    startTime,
    endTime,
    perks,
    isHidden,
    isSoldOut,
    eventId
  };
  const response = await apiCall({
    name: "editTicket",
    urlExtra: `/${id}`,
    data: payload
  });
  return response;
}
export {deleteTicket, createTicket,editTicket};