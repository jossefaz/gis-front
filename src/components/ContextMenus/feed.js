import REGISTRY from "./registry";
import { mainStore as store } from "../../state/store";
import { setContextMenu } from "../../state/actions";

const callback = async (source, featureID, menu) => {
  await store.dispatch(setContextMenu(source, featureID, menu));
};

export default async (layerId, featureId, properties) => {
  Object.keys(REGISTRY).map((source) => {
    const config = REGISTRY[source];
    if (config.status) {
      let importComp;
      try {
        importComp = import(`./${config.path}/feeder.js`);
      } catch (error) {
        console.error(`Context menu loader failed for menu ${config.path}`);
        return;
      }
      //TODO : handle not existing path
      importComp
        .then((fn) => {
          fn.default(config.url, layerId, featureId, properties, (menu) =>
            callback(source, featureId, menu)
          );
        })
        .catch((err) => {
          console.log(
            "One of the context Menus component did not mount as expected, check its configuration and/or its source code error :",
            err
          );
        });
    }
  });
};
