import { apiCall } from "../utils/axiosFormat";

const createSeries = async (name: String, userId: String, description: String, coverImage: File | String): Promise<any> => {
  const formData = new FormData();
  formData.append('name', name as string);
  formData.append('userId', userId as string);
  formData.append('description', description as string);
  
  if (coverImage instanceof File) {
    formData.append('coverImage', coverImage);
  } else if (coverImage) {
    formData.append('coverImage', coverImage as string);
  }

  const response = await apiCall({
    name: "createSeries",
    data: formData,
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
const updateSeries = async (id: String, userId: String, description: String, coverImage: File | String): Promise<any> => {
  const formData = new FormData();
  formData.append('userId', userId as string);
  formData.append('description', description as string);
  
  if (coverImage instanceof File) {
    formData.append('coverImage', coverImage);
  } else if (coverImage) {
    formData.append('coverImage', coverImage as string);
  }

  const response = await apiCall({
    name: "updateSeries",
    urlExtra: `/${id}`,
    data: formData
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