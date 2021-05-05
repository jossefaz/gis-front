import { mainStore as store } from "../../state/store";
import { FeatureLayer } from "./FeatureLayer";
import { StreamingSystem } from "../../state/actions/stream";
import {
  updateFeatureAttributes,
  setFilterIds,
} from "../../state/actions/stream";
import { loadChannels } from "../../communication/communicationManager";
import { streamingSystemSelector } from "../../state/selectors/streamSelector";
import SLDReader from "@nieuwlandgeo/sldreader/src/Reader";
import * as Utils from "@nieuwlandgeo/sldreader/src/Utils";
import { createOlStyleFunction } from "@nieuwlandgeo/sldreader/src/OlStyler";
import axios from "axios";
import config from "../../configuration";
import watch from "redux-watch";

export var StreamingLayer = (function () {
  var streamingLayer = null;
  var channel = null;
  function StreamingLayer(features, props) {
    var channels = config().channels;
    if (channels && props["channelRegistrationName"] != null)
      this.channel = channels.find(
        (channel) => channel.Channel == props["channelRegistrationName"]
      );

    this.streamingLayer = new FeatureLayer(null, props);

    axios.get(props.sldUrl).then((sld) => {
      console.log(sld);

      var sldObject = SLDReader(sld.data);
      window.sldObject = sldObject;
      const sldLayer = Utils.getLayer(sldObject);
      const style = Utils.getStyle(sldLayer, props.sldName);
      const featureTypeStyle = style.featuretypestyles[0];

      var styleF = createOlStyleFunction(featureTypeStyle);
      this.streamingLayer.vl.setStyle(styleF);
    });

    this.streamingLayer.vl.getSource().once("change", (e) => {
      if (e.target.getState() == "ready") {
        let features = [];
        e.target.getFeatures().forEach((feature) => {
          let f = Object.assign({}, feature.values_);
          if (f.hasOwnProperty("geometry"));
          delete f["geometry"];
          features.push(f);
        });

        store.dispatch(
          StreamingSystem(
            features,
            props["layerName"],
            props["geoJoinFieldName"]
          )
        );
        let w = watch(() =>
          streamingSystemSelector(store.getState(), props["layerName"])
        );
        store.subscribe(
          w((newVal, oldVal) => {
            this.streamingLayer.setProperties(newVal, {
              targetId: this.channel["messageItemIdFieldName"],
              sourceId: props["geoJoinFieldName"],
              symbologyField: props["symbologyField"],
            });
          })
        );
        loadChannels(this.channel, props["symbologyCalculation"]);
        if (this.channel) {
          const arr = this.channel.Channel.split(".");
          axios
            .get(
              "http://meitarimds:2210/api/ro_reality/" + arr[0] + "/" + arr[1]
            )
            .then((request) => {
              store.dispatch(setFilterIds(this.channel.reduxTarget, null));
              store.dispatch(
                updateFeatureAttributes(
                  request.data,
                  this.channel.reduxTarget,
                  this.channel.messageItemIdFieldName,
                  props["symbologyCalculation"]
                )
              );
              store.dispatch(
                setFilterIds(this.channel.reduxTarget, request.data)
              );
            });
        }
      }
    });
    return this.streamingLayer;
  }

  return StreamingLayer;
})();
