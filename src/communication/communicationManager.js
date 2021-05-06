import { updateFeatureAttributes, setFilterIds } from "../state/actions/stream";
import { mainStore as store } from "../state/store";
import wsNats from "websocket-nats";

export const loadChannels = (chanel, symbologyCalculation, reduxTarget) => {
  if (chanel) {
    const channelItem = chanel;

    if (channelItem) {
      const nats = wsNats.connect("ws://meitarimds:4223");
      nats.subscribe(
        channelItem.system + "." + channelItem.branch + ".*",
        (msg) => {
          const data = [];
          // console.log(msg);
          msg = JSON.parse(msg);
          data.push(msg);
          switch (channelItem.reduxFunction) {
            case "UPDATE_FEATURE_ATTRIBUTES":
              // store.dispatch(setFilterIds(channelItem.reduxTarget, null));
              store.dispatch(
                updateFeatureAttributes(
                  data,
                  reduxTarget,
                  channelItem.messageItemIdFieldName,
                  symbologyCalculation,
                  channelItem.system
                )
              );
              store.dispatch(setFilterIds(reduxTarget, data,  channelItem.system));
              break;
            default:
              break;
          }
        }
      );
    }
  }
};
