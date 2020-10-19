/**
 * Generate a new div with a given selector, classes, innerHTML
 * @param {string} selector represents a string that can select the generated div by id
 * @param {string} innerHtml represents a string of the innerHTML that will be injected as the new generated div innerHTML
 * @param {string} classes represents a string of the generated div classes
 */

export const generateNewDiv = (selector, classes, innerHtml) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.setAttribute("id", selector);
  overlayDiv.setAttribute("class", classes);
  overlayDiv.innerHTML = innerHtml;
  return overlayDiv;
};
