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
import isEqual from "is-equal";

export let StreamingLayer = (function () {
  let streamingLayer = null;

  function StreamingLayer(features, props) {
    this.streamingLayer = new FeatureLayer(null, props);

    axios.get(props.sldUrl).then((sld) => {
      console.log(sld);

      let sldObject = SLDReader(sld.data);
      window.sldObject = sldObject;
      const sldLayer = Utils.getLayer(sldObject);
      const style = Utils.getStyle(sldLayer, props.sldName);
      const featureTypeStyle = style.featuretypestyles[0];

      let styleF = createOlStyleFunction(featureTypeStyle);
      this.streamingLayer.vl.setStyle(styleF);
    });

    this.streamingLayer.vl.getSource().once("change", (e) => {
      if (e.target.getState() === "ready") {
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

        const a = streamingSystemSelector();

        let w = watch(() => a(store.getState(), props["layerName"]));

        let channels = config().channels;
        if (channels && props["channelRegistrationName"] != null) {
          let channelRegistrationArr = [];
          channelRegistrationArr = props["channelRegistrationName"].split(",");
          channelRegistrationArr.forEach((chanelName) => {
            let channel = channels.find(
              (channelItem) => channelItem.Channel === chanelName
            );

            if (channel) {
              store.subscribe(
                w((newVal, oldVal) => {
                  if (newVal && newVal.length > 0 && !isEqual(newVal, oldVal)) {
                    // console.log(
                    //   "this is a message of :" + props["layerName"] +
                    //     newVal[0].adaptorId +
                    //     "id:" +
                    //     newVal[0].id
                    // );

                    let data = newVal;

                    if (data != null && data.length > 0) {
                      let sourceId = props["geoJoinFieldName"];

                      let lyr = this.streamingLayer.vl;
                      let st = lyr.getStyleFunction();
                      if (lyr) {
                        let ftrs = lyr.getSource();

                        data.forEach(function (sourceItem) {
                          let id = sourceItem["adaptorId"] + "." + sourceItem[sourceId] ;
                          let f = ftrs.getFeatureById(id);

                          if (f) {
                            for (let prop in sourceItem) {
                              if (prop !== "geometry") {
                                f.set(prop, sourceItem[prop]);
                              }
                            }
                          }
                        });
                      }
                    }
                  }
                })
              );

        
              axios.get("http://meitarimds:2210/api/ro_reality/" + channel.system + "/" + channel.branch)                
                .then((request) => {
                  if (request != null && request.data.length > 0)
                    store.dispatch(setFilterIds(props["layerName"], null, channel.system));
                    store.dispatch(
                      updateFeatureAttributes(
                        request.data,
                        props["layerName"],
                        channel.messageItemIdFieldName,
                        props["symbologyCalculation"],
                        channel.system
                      )
                    );
                    store.dispatch(
                      setFilterIds(props["layerName"], request.data, channel.system)
                    );
                });
                loadChannels(channel, props["symbologyCalculation"],props["layerName"]);           
            }
          });
        }
      }
    });
    return this.streamingLayer;
  }

  return StreamingLayer;
})();
