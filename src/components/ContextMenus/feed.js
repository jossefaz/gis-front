import REGISTRY from "./registry";
import store from "../../redux/store";
import { setContextMenu } from "../../redux/actions/features";

const callback = async (source, featureID, menu) => {
  await store.dispatch(setContextMenu(source, featureID, menu));
};

export default async (layerId, featureId) => {
  Object.keys(REGISTRY).map((source) => {
    const config = REGISTRY[source];
    if (config.status) {
      import(`${config.path}/feeder.js`).then((fn) => {
        fn.default(config.url, layerId, featureId, (menu) =>
          callback(source, featureId, menu)
        );
      });
    }
  });
};
