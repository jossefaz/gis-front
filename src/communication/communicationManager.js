// import channels from "../usefulgarbage/channels";
// import tools from "../usefulgarbage/tools";
import {
  addLayer,
  updateFeatureAttributes,
  setFilterIds,
  udpatedInfo,
} from "../redux/actions/actions";
// import {ADD_LAYER,UPDATE_FEATURE_ATTRIBUTES} from '../actions/actionsTypes';
// import {
//   WSkubeMQ
// } from "../comm/WSkubeMQ.js";
// import NATS from "../communication/WSnatsMQ"
import {
  Base64
} from "../utils/convertors/base64";
import store from "../redux/store.js";
import wsNats from 'websocket-nats';
import config from "react-global-configuration";

export const loadChannels = () => {
  var channels = config.get("channels");
  // channels.map(function (channel) {
  //   var ws = new WSkubeMQ(
  //     "172.17.22.215:9090",
  //     "MTCS.Units.*",
  //     "DataServer",
  //     "",
  //     {
  //       onMessage: onMessageRecived,
  //       onError: onErrorRecived,
  //       decoder: Base64.decode,
  //     }
  //   );
  // });
  // var nats = NATS.connect('ws://localhost:4223');
  var nats = wsNats.connect('ws://localhost:4223');
  nats.subscribe("MTCS.Units.*", (msg) => {
    console.log(msg);
    var channelItem = channels[0];
    var data = [];

    if (channelItem) {
      //var newMessage = JSON.parse(msg.Body.replace(" - (1)", ""));
      var newMessage = JSON.parse(msg.Body);


      data.push(newMessage);
      switch (channelItem.reduxFunction) {
        case "UPDATE_FEATURE_ATTRIBUTES":
          store.dispatch(setFilterIds("units", null));
          store.dispatch(
            updateFeatureAttributes(
              data,
              channelItem.reduxTarget,
              channelItem.idSourceKey
            )
          );
          store.dispatch(setFilterIds("units", data));
          break;
        default:
          break;
      }
    }
  });
};

// export const onMessageRecived = (message) => {
//   var channelItem = channels[0];
//   var data = [];

//   if (channelItem) {
//     var newMessage = JSON.parse(message.Body.replace(" - (1)", ""));

//     data.push(newMessage);
//     switch (channelItem.reduxFunction) {
//       case "UPDATE_FEATURE_ATTRIBUTES":
//         store.dispatch(setFilterIds("units", null));
//         store.dispatch(
//           updateFeatureAttributes(
//             data,
//             channelItem.reduxTarget,
//             channelItem.idSourceKey
//           )
//         );
//         store.dispatch(setFilterIds("units", data));
//         break;
//       default:
//         break;
//     }
//   }
// };

// export const onErrorRecived = (error) => {
//   console.log(error);
// };