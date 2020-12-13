import { lazy } from "react";
import config from "react-global-configuration";
const conf = config.get("ContextMenus");
export default {
  Manti: {
    component: lazy(() => import("./Manti")),
    url: conf.Manti.url,
    status: conf.Manti.up,
    path: conf.Manti.path,
  },
};
