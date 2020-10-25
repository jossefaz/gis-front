import { useToasts } from "react-toast-notifications";
import React from "react";
export default (Component) => {
  return function WrappedComponent(props) {
    const toastFuncs = useToasts();
    return <Component {...props} {...toastFuncs} />;
  };
};
