
type ToastProps = {
  title: string;
  message: string;
  type?: "success" | "error" | "info";
};

const bgColors = {
  success: "bg-success-light text-success-dark border-success-soft",
  error: "bg-error-light text-error-dark border-error-soft",
  info: "bg-info-light text-info-dark border-info-soft",
};

export const CustomToast = ({ title, message, type = "info" }: ToastProps) => {
  return (
    <div className={`border-l-4 p-3 rounded shadow-sm w-full  ${bgColors[type]} toast-${type}`}>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs mt-1">{message}</p>
    </div>
  );
};
