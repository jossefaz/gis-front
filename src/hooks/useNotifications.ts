import { useToasts } from "react-toast-notifications";

const useNotifications = () => {
  const toastFuncs = useToasts();
  const successNotification = (message: string) => {
    toastFuncs.addToast(message, {
      appearance: "success",
      autoDismiss: true,
    });
  };
  const errorNotification = (message: string) => {
    toastFuncs.addToast(message, {
      appearance: "error",
      autoDismiss: true,
    });
  };

  return { successNotification, errorNotification };
};

export default useNotifications;
