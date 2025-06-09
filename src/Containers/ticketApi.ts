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

export {deleteTicket, createTicket};