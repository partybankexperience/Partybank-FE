import { apiCall } from "../utils/axiosFormat";

export const getDashboardOverview = async (): Promise<any> => {
  const response = await apiCall({
    name: "getDashboardOverview",
    alert: false,
  });
  return response;
};