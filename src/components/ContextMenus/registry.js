import config from "react-global-configuration";
import loadable from "@loadable/component";
const conf = config.get("ContextMenus");

const buildRegistry = () => {
  const registry = {};
  Object.keys(conf).map((provider) => {
    const { path, url, status } = conf[provider];
    registry[provider] = {
      component: loadable(() => import(`./${path}`)),
      status,
      url,
      path,
    };
  });
  return registry;
};

export default buildRegistry();
