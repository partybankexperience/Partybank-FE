import { apiCall } from "../utils/axiosFormat";

const createSeries = async (name: string, userId: string, description: string, coverImage: string): Promise<any> => {
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
    alert: false
  });
  return response;
}
const getSeriesById =async (id: string): Promise<any> =>{
  const response = await apiCall({
    name: "getSeriesById",
    urlExtra: `/${id}`
  });
  return response;
}
const updateSeries = async (id: string, name: string, description: string, coverImage: string): Promise<any> => {
  const payload = {
    name: name as string,
    description: description as string,
    coverImage: coverImage as string,
  };

  const response = await apiCall({
    name: "updateSeries",
    urlExtra: `/${id}`,
    data: payload
  });
  return response;
}
const deleteSeries =async (id: string): Promise<any> =>{
  const response = await apiCall({
    name: "deleteSeries",
    urlExtra: `/${id}/soft-delete`
  });  return response;
}
const getSeriesBySlug = async (slug: string): Promise<any> => {
  const response = await apiCall({
    name: "getSeriesBySlug",
    urlExtra: `/${slug}`
  });
  return response;
}
export { createSeries,getSeries,getSeriesById,updateSeries,deleteSeries,getSeriesBySlug }