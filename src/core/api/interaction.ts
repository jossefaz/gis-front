import InteractionProxy from "../proxy/interaction";
import { getFocusedMapProxy } from "./map";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import NessKeys from "../keys";
import { Style } from "ol/style";
import mapStyle from "../mapStyle";
import { GenerateUUID } from "../../utils/uuid";
import { InteractionOptions } from "../types/interaction";

export function getInteraction<T>(uuid: string): T | false {
  const proxy = getInteractionProxy(uuid);
  if (proxy && proxy.OLInteraction) {
    return <T>(<unknown>proxy.OLInteraction);
  }
  return false;
}
export const getInteractionProxy = (uuid: string) => {
  return getFocusedMapProxy().getInteractionProxy(uuid);
};

export const getInteractionVectorSource = (
  uuid: string
): VectorSource | false => {
  const proxy = getInteractionProxy(uuid);
  if (proxy && proxy.OLInteraction) {
    const vsuid = proxy.OLInteraction.get(NessKeys.VECTOR_SOURCE);
    if (vsuid) {
      return getFocusedMapProxy().getVectorSource(vsuid);
    }
    return false;
  }
  return false;
};

export const getInteractionGraphicLayer = (
  uuid: string
): VectorLayer | false => {
  const proxy = getInteractionProxy(uuid);
  if (proxy && proxy.OLInteraction) {
    const gluid = proxy.OLInteraction.get(NessKeys.GRAPHIC_LAYER);
    if (gluid) {
      return getFocusedMapProxy().getGraphicLayer(gluid);
    }
    return false;
  }
  return false;
};

export const addInteraction = (config: InteractionOptions): string | false => {
  const proxy = new InteractionProxy(config);
  getFocusedMapProxy().addInteractionProxy(proxy);
  if (proxy.addSelfToMap(getFocusedMapProxy())) {
    console.log("getFocusedMapProxy", getFocusedMapProxy());
    return proxy.uuid.value;
  }

  return false;
};

export const removeInteraction = (uuid: string) => {
  const InteractionProxy = getInteractionProxy(uuid);
  if (InteractionProxy) {
    InteractionProxy.RemoveSelfFromMap();
  }
  return true;
};

export const getEmptyVectorLayer = (inStyle?: Style) => {
  const style = inStyle || mapStyle.DRAW_END;
  const source = new VectorSource();
  const vector = new VectorLayer({ source, style });
  const uuid = GenerateUUID();
  source.set("__NessUUID__", uuid);
  vector.set("__NessUUID__", uuid);
  return { source, vector };
};
