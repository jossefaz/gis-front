import React from "react";
import Providers from "../index";
import axios from "axios";
import API from "../../../../core/api";
import { convertCoordToIsraelTM } from "../../../../utils/projections";
import config from "react-global-configuration";
export default (subscriber_func) => {
  const BASE_URL = config.get("Search").Geocode.url;
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
    API.features.zoomTo(item.geometry);
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
