import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { fetchConfig } from "./configuration";
import { Provider } from "react-redux";
import store from "./redux/store";
// import "./style.css";
import "./style/style.scss";

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
