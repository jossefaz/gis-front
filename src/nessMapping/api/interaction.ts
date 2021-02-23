export const getInteraction = (uuid) => {
  return NessInteraction.getInstance().getInteractionProxy(uuid).OLInteraction;
};
export const getInteractionProxy = (uuid) => {
  return NessInteraction.getInstance().getInteractionProxy(uuid);
};
export const getInteractionVectorSource = (uuid) => {
  const vsuid = getInteractionProxy(uuid).OLInteraction.get(
    NessKeys.VECTOR_SOURCE
  );
  return getFocusedMapProxy().getVectorSource(vsuid);
};

export const getInteractionGraphicLayer = (uuid) => {
  const gluid = getInteractionProxy(uuid).OLInteraction.get(
    NessKeys.GRAPHIC_LAYER
  );
  return getFocusedMapProxy().getGraphicLayer(gluid);
};

// SET
export const addInteraction = (config) => {
  const InteractionProxy = NessInteraction.getInstance().addInteractionProxy(
    config
  );
  return InteractionProxy.AddSelfToMap(getFocusedMapProxy());
};

// DELETE
export const removeInteraction = (uuid) => {
  const InteractionProxy = NessInteraction.getInstance().getInteractionProxy(
    uuid
  );
  InteractionProxy.RemoveSelfFromMap();
  return true;
};
