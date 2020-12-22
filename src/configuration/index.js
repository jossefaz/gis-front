import config from "react-global-configuration";
import { get_env } from "./env";

export const fetchConfig = async () => {
  const env = await get_env();
  if (!env) {
    return false;
  }

  const conf = Object.assign(
    env.CONFIG.default,
    { Geoserver: env.GEOSERVER_ENDPOINT },
    { MD_server: env.MD_SERVER_ENDPOINT }
  );

  try {
    config.set(conf, { freeze: false });
    return true;
  } catch (error) {
    return false;
  }
};
