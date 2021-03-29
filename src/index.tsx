import ReactDOM from "react-dom";
import App from "./containers/App/App";
import { fetchConfig } from "./configuration";
import { Provider } from "react-redux";
import { mainStore as store } from "./state";
// import "./style.css";
import "./style/style.scss";
import "semantic-ui-css/semantic.min.css";

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
