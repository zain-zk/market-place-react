import { toast } from "react-toastify";

export const notifySuccess = (msg)=>{
 toast.success(msg )};

 export const notifyError = (msg) =>
  toast.error(msg, { icon: "❌" });

export const notifyInfo = (msg) =>
  toast.info(msg, { icon: "ℹ️" });
