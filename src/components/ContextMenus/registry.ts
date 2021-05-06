import config from "../../configuration";
import loadable, { LoadableClassComponent } from "@loadable/component";

export interface ContextMenuProvider {
  component: LoadableClassComponent<any>;
  status: number;
  url: string;
  path: string;
  configuration: { [key: string]: any };
}

export interface ContextMenuProvidersRegistry {
  [providerName: string]: ContextMenuProvider;
}

const buildRegistry = () => {
  const conf = config().ContextMenus;
  const registry: ContextMenuProvidersRegistry = {};
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
