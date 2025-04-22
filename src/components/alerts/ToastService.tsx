import { toast } from "react-toastify";
import { CustomToast } from "./CustomToast";

export const successAlert = (title: string, message: string) => {
  toast(<CustomToast title={title} message={message} type="success" />);
};

export const errorAlert = (title: string, message: string) => {
  toast(<CustomToast title={title} message={message} type="error" />);
};

export const infoAlert = (title: string, message: string) => {
  toast(<CustomToast title={title} message={message} type="info" />);
};
