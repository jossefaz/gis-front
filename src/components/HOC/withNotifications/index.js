import { useToasts } from "react-toast-notifications";
export default (Component) => {
  return function WrappedComponent(props) {
    const toastFuncs = useToasts();
    const successNotification = (message) => {
      toastFuncs.addToast(message, {
        appearance: "success",
        autoDismiss: true,
      });
    };
    const errorNotification = (message) => {
      toastFuncs.addToast(message, {
        appearance: "error",
        autoDismiss: true,
      });
    };
    return (
      <Component
        {...props}
        {...toastFuncs}
        successNotification={successNotification}
        errorNotification={errorNotification}
      />
    );
  };
};
