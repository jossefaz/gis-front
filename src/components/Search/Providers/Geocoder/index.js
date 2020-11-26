import Providers from "../index";
import axios from "axios";
export default (subscriber_func) => {
  const BASE_URL = "http://127.0.0.1:4000";
  const search = async (what, cb) => {
    axios
      .get(`${BASE_URL}/v1/autocomplete`, {
        params: {
          text: what,
        },
      })
      .then((res) => {
        if (
          res.data.features instanceof Array &&
          res.data.features.length > 0
        ) {
          const data = res.data.features.map((f) => {
            return { ...f, ...f.properties };
          });
          cb(null, data);
        }
      })
      .catch((err) => cb(err, []));
  };
  Providers.getInstance().register(
    search,
    "Geocoder",
    subscriber_func,
    (item) => console.log("from callback", item)
  );
};
