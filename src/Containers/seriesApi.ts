import { apiCall } from "../utils/axiosFormat";

const createSeries = async (name: String, userId: String, description: String, coverImage: String): Promise<any> => {
  const payload = {
    name: name as string,
    userId: userId as string,
    description: description as string,
    coverImage: coverImage as string
  };

  const response = await apiCall({
    name: "createSeries",
    data: payload,
  });
  return response;
};
const getSeries =async (): Promise<any> =>{
  const response = await apiCall({
    name: "getSeries",
    
  });
  return response;
}
const getSeriesById =async (id: String): Promise<any> =>{
  const response = await apiCall({
    name: "getSeriesById",
    urlExtra: `/${id}`
  });
  return response;
}
const updateSeries = async (id: String, userId: String, description: String, coverImage: String): Promise<any> => {
  const payload = {
    userId: userId as string,
    description: description as string,
    coverImage: coverImage as string
  };

  const response = await apiCall({
    name: "updateSeries",
    urlExtra: `/${id}`,
    data: payload
  });
  return response;
}
const deleteSeries =async (id: String): Promise<any> =>{
  const response = await apiCall({
    name: "deleteSeries",
    urlExtra: `/${id}`
  });  return response;
}
export { createSeries,getSeries,getSeriesById,updateSeries,deleteSeries }