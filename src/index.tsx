import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App/container";
import { fetchConfig } from "./configuration";
import { Provider } from "react-redux";
import { mainStore as store } from "./state";
<<<<<<< HEAD
// import "./style.css";
import "./style/style.scss";
=======
import "./style.css";
>>>>>>> 163339063b585e906a18cd3faf19b7f6eaf4ba07

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
