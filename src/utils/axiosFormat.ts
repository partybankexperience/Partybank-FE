import axios from "axios";
import { urlPropTypes } from "./types";
import { endPoints } from "./apiLib";
import { Storage } from "../stores/InAppStorage";
import { baseURL } from "./api.env";
import { errorAlert, successAlert } from "../components/alerts/ToastService";

const baseUrl = (): string => `${baseURL}`;

export const apiCall = ({
  urlExtra,
  name,
  data = {},
  params = {},
  action = () => undefined,
  alert=true
}: urlPropTypes) => {
  return new Promise((res, rej) => {
    const theName = name as keyof typeof endPoints;
    // const userDetails: any = Storage?.getItem('user') || '{}';
    const token: any = Storage?.getItem("token") || "";
    let headers: any = endPoints[theName]?.headers || {};

    if (endPoints[theName]?.auth) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    axios({
      url: `${baseUrl()}${endPoints[theName]?.url}${urlExtra || ""}`,
      method: endPoints[theName]?.method,
      headers,
      data,
      params,
    })
      .then(async (r) => {
        const returned = await action(r.data);
        console.log(r, "Response Data:", returned);
        res(r.data.respBody || r.data)
        if (alert) {
        successAlert(
          "Success",
          r?.data?.message || "Request completed successfully."
        );}
        // if (r.data.respCode === "00" || r.status === 200) {
        //   res(r.data.respBody || r.data);
        // } else {
        //   console.error("Response Error:", r);
        //   errorAlert("Oops!", r.data.respMessage || "Something went wrong.");
        // }
      })
      .catch((err) => {
        // Check if the error response is 401
        if (err.response?.status === 401) {
          // Clear token and redirect with state to trigger notification
          Storage.clearItem()
          // Use history.pushState for navigation without refresh
          window.history.pushState(null, '', '/?state=notAuthenticated');
          // Dispatch a popstate event to trigger navigation
          window.dispatchEvent(new PopStateEvent('popstate'));
          return;
        }
        errorAlert(
          "Network Error",
          err.response?.data?.message || err.message || "Something went wrong."
        );
        rej(err);
      });
  });
};