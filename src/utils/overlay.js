import { generateNewDiv } from "./html";

/**
 * Generate a new Overlay definition object with a given selector, classes, innerHTML
 * @param {string} selector represents a string that can select the generated div by id
 * @param {string} innerHtml represents a string of the innerHTML that will be injected as the new generated div innerHTML
 * @param {string} classes represents a string of the generated div classes
 * @param {string} widgetName represents the widget name that consume this overlay
 */
export const generateTextOverlay = (selector, classes, text, widgetName) => {
  return {
    overlay: {
      element: generateNewDiv(selector, classes, text),
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      dragging: false,
    },
    widgetName,
    content: text,
    selector,
  };
};
