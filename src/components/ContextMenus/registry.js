import config from "../../configuration";
import loadable from "@loadable/component";

const buildRegistry = () => {
  const conf = config().ContextMenus;
  const registry = {};
  Object.keys(conf).map((provider) => {
    const { path, url, status, configuration } = conf[provider];
    registry[provider] = {
      component: loadable(() => import(`./${path}`)),
      status,
      url,
      path,
      configuration,
    };
  });
  return registry;
};

export default buildRegistry();
