import { generateNewDiv } from "./html";
import API from "../core/api";
import {
  unsetOverlay,
  unsetOverlays,
  setOverlayProperty,
  setOverlay,
} from "../state/actions";
import { mainStore as store } from "../state/store";
import _ from "lodash";
const { getFocusedMap, getFocusedMapProxy } = API.map;
const { getOverlay } = API.overlays;
export class OverlayUtil {
  constructor(widgetName) {
    this.widget = widgetName;
    this.CLASSNAMES = {
      TEXT: "ol-tooltip ol-tooltip-measure rtl-layout",
      HIDDEN: "hidden",
      FINISH: "ol-tooltip ol-tooltip-static",
    };
  }

  /**
   * Generate a new Overlay definition object with a given selector, classes, innerHTML
   * @param {string} selector represents a string that can select the generated div by id
   * @param {string} innerHtml represents a string of the innerHTML that will be injected as the new generated div innerHTML
   * @param {string} classes represents a string of the generated div classes
   * @param {string} widgetName represents the widget name that consume this overlay
   */
  static generateTextOverlay = (selector, classes, widgetName, text) => {
    const content = text || "";
    return {
      overlay: {
        element: generateNewDiv(selector, classes, content),
        offset: [0, -15],
        positioning: "top-center",
        stopEvent: false,
        dragging: false,
      },
      widgetName,
      content: content,
      selector,
    };
  };

  static generateReadyOverlay = (IDselector, classes, widgetName) => {
    return {
      overlay: {
        element: document.getElementById(IDselector),
        offset: [0, -15],
        positioning: "top-center",
        stopEvent: false,
        dragging: false,
      },
      widgetName,
      content: "",
      selector: IDselector,
    };
  };

  get store() {
    const currentOverlayStore = store.getState().Overlays;
    if (
      this.widget in currentOverlayStore &&
      this.currentMapUUID in currentOverlayStore[this.widget]
    ) {
      return _.omit(currentOverlayStore[this.widget][this.currentMapUUID], [
        "focused",
      ]);
    }
    return false;
  }

  get focused() {
    const currentOverlayStore = store.getState().Overlays;
    if (
      this.widget in currentOverlayStore &&
      this.currentMapUUID in currentOverlayStore[this.widget]
    ) {
      return currentOverlayStore[this.widget][this.currentMapUUID].focused;
    }
    return false;
  }

  get currentMapUUID() {
    return getFocusedMapProxy().uuid.value;
  }

  newText = (text, classes) => {
    const selector = `${this.widget}${this.currentMapUUID}`;
    const style = classes ? classes : this.CLASSNAMES.TEXT;
    store.dispatch(
      setOverlay(
        OverlayUtil.generateTextOverlay(selector, style, this.widget, text)
      )
    );
    const lastID = this.focused;
    return lastID;
  };

  newReact = (reactComponentId, classes) => {
    const selector = reactComponentId;
    const style = classes ? classes : this.CLASSNAMES.TEXT;
    store.dispatch(
      setOverlay(OverlayUtil.generateReadyOverlay(selector, style, this.widget))
    );
    const lastID = this.focused;
    return lastID;
  };

  addToMap = (uuid, position) => {
    const overlay = getOverlay(uuid);
    const pos = position || getFocusedMap().getView().getCenter();
    overlay.setPosition(pos);
  };

  addDraggable = (uuid, color) => {
    const overlay = this.store[uuid];
    const overlayDiv = document.getElementById(overlay.selector);
    overlayDiv.setAttribute("uuid", uuid);
    overlayDiv.setAttribute("dragging", false);
    if (color) overlayDiv.style.backgroundColor = color;
    const that = this;
    overlayDiv.addEventListener("mousedown", function (evt) {
      getOverlay(this.id.split(that.widget)[1]).set("dragging", true);
    });
  };

  unset = (uuid) => {
    if (this.store && uuid in this.store) {
      store.dispatch(unsetOverlay({ uuid, widgetName: this.widget }));
    }
  };

  unsetAll = () => {
    store.dispatch(
      unsetOverlays({
        overlays: Object.keys(this.store),
        widgetName: this.widget,
      })
    );
  };

  dragOverlay = (evt, cb) => {
    if (this.store) {
      Object.keys(this.store).forEach((ol) => {
        const overlay = getOverlay(ol);
        if (overlay.get("dragging")) {
          cb();
          overlay.setPosition(evt.coordinate);
        }
      });
    }
  };

  toggleAll = () => {
    Object.keys(this.store).forEach((uuid) => {
      const overlaydiv = document.querySelector(
        `#${this.store[uuid].selector}`
      );
      const isHidden = overlaydiv.hidden;
      overlaydiv.hidden = !isHidden;
    });
  };

  edit = (uuid, content, styleclasses, save) => {
    const overlay = this.store[uuid];
    const overlayDiv = overlay
      ? document.querySelector(`#${overlay.selector}`)
      : document.querySelector(`#${this.WIDGET_NAME}${uuid}`);
    if (overlayDiv) {
      save &&
        store.dispatch(
          setOverlayProperty({
            widgetName: this.widget,
            uuid,
            property: "content",
            value: content,
          })
        );
      overlayDiv.innerHTML = content;
      if (styleclasses) overlayDiv.className = styleclasses;
    }
  };

  unDragOverlay = (cb) => {
    if (this.store) {
      Object.keys(this.store).forEach((ol) => {
        if (getOverlay(ol).get("dragging")) {
          cb();
          getOverlay(ol).set("dragging", false);
        }
      });
    }
  };

  toggleOverlayClass = (uuid, show, classTrue, classFalse) => {
    const selector = this.store[uuid].selector;
    const overlayDiv = document.querySelector(`#${selector}`);
    overlayDiv.className = show ? classTrue : classFalse;
  };
}
