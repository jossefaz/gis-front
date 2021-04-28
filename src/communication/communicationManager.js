import { updateFeatureAttributes, setFilterIds } from "../state/actions/stream";
import { mainStore as store } from "../state/store";
import wsNats from "websocket-nats";

export const loadChannels = (chanel, symbologyCalculation) => {
  if (chanel) {
    const channelItem = chanel;

    if (channelItem) {
      const nats = wsNats.connect("ws://meitarimds:4223");
      nats.subscribe(channelItem.Channel + ".*", (msg) => {
        const data = [];
        msg = JSON.parse(msg);
        data.push(msg);
        switch (channelItem.reduxFunction) {
          case "UPDATE_FEATURE_ATTRIBUTES":
            store.dispatch(setFilterIds(channelItem.reduxTarget, null));
            store.dispatch(
              updateFeatureAttributes(
                data,
                channelItem.reduxTarget,
                channelItem.messageItemIdFieldName,
                symbologyCalculation
              )
            );
            store.dispatch(setFilterIds(channelItem.reduxTarget, data));
            break;
          default:
            break;
        }
      });
    }
  }
};
