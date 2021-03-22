import API from "./api";

export const printCoreState = () => {
  console.log(`Current Map Proxy`, API.map.getFocusedMapProxy());
  console.log(
    `Current Interactions Proxies`,
    API.map.getFocusedMapProxy().interactions
  );
  console.log(`Current Overlay Proxies`, API.map.getFocusedMapProxy().overlays);
  console.log(`Current Layer Proxies`, API.map.getFocusedMapProxy().layers);
};
