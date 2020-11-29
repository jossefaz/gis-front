import React from "react";
import Providers from "../index";
import axios from "axios";
import { zoomTo } from "../../../../nessMapping/api";
import { convertCoordToIsraelTM } from "../../../../utils/projections";
export default (subscriber_func) => {
  const BASE_URL = "http://127.0.0.1:4000";
  const renderSuggestion = (suggestion) => {
    let content = suggestion.name;
    if ("housenumber" in suggestion && suggestion.housenumber) {
      content += `, ${suggestion.housenumber}`;
    }
    return <div>{content}</div>;
  };
  const onItemClick = (item) => {
    item.geometry.coordinates = convertCoordToIsraelTM(
      "EPSG:4326",
      item.geometry.coordinates
    );
    zoomTo(item.geometry);
  };
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
    onItemClick,
    renderSuggestion
  );
};
