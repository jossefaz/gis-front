/**
 * Get all objects (for example : overlays or interactions) that belongs to this widget and this current map.
 * If there is no Overlays in the current map with the current widget,
 * This function return false
 */
export const getWidgetObjectsFromStore = (widgetname, store, mapuuid) => {
  if (widgetname in store && mapuuid in store[widgetname]) {
    return store[widgetname][mapuuid];
  }
  return false;
};
