import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App/container";
import { fetchConfig } from "./configuration";
import { Provider } from "react-redux";
import { mainStore as store } from "./state";
import "./style.css";

fetchConfig().then((config) => {
  if (config) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.querySelector("#root")
    );
  }
});
