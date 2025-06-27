import { apiCall } from "../utils/axiosFormat";

export const getDashboardOverview = async (): Promise<any> => {
  const response = await apiCall({
    name: "getDashboardOverview",
  });
  return response;
};