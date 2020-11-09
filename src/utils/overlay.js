import { generateNewDiv } from "./html";
import {
  getFocusedMap,
  getFocusedMapProxy,
  getInteractionGraphicLayer,
  getInteractionVectorSource,
  getInteraction,
  getOverlay,
} from "../nessMapping/api";
import {
  unsetOverlay,
  unsetOverlays,
  setOverlayProperty,
  setOverlay,
} from "../redux/actions/overlay";
import store from "../redux/store";
import _ from "lodash";
import ReactDOM from "react-dom";
export class OverlayUtil {
  constructor(widgetName) {
    this.widget = widgetName;
    this.CLASSNAMES = {
      TEXT: "ol-tooltip ol-tooltip-measure",
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
        positioning: "bottom-center",
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
        positioning: "bottom-center",
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

  newText = async (text, classes) => {
    const selector = `${this.widget}${this.currentMapUUID}`;
    const style = classes ? classes : this.CLASSNAMES.TEXT;
    await store.dispatch(
      setOverlay(
        OverlayUtil.generateTextOverlay(selector, style, this.widget, text)
      )
    );
    const lastID = this.focused;
    return lastID;
  };

  newReact = async (reactComponentId, classes) => {
    const selector = reactComponentId;
    const style = classes ? classes : this.CLASSNAMES.TEXT;
    await store.dispatch(
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

  unset = async (uuid) => {
    if (this.store && uuid in this.store) {
      await store.dispatch(unsetOverlay({ uuid, widgetName: this.widget }));
    }
  };

  unsetAll = async () => {
    await store.dispatch(
      unsetOverlays({
        overlays: Object.keys(this.store),
        widgetName: this.widget,
      })
    );
  };

  dragOverlay = (evt, cb) => {
    if (this.store) {
      Object.keys(this.store).map((ol) => {
        const overlay = getOverlay(ol);
        if (overlay.get("dragging")) {
          cb();
          overlay.setPosition(evt.coordinate);
        }
      });
    }
  };

  toggleAll = () => {
    Object.keys(this.store).map((uuid) => {
      const overlaydiv = document.querySelector(
        `#${this.store[uuid].selector}`
      );
      const isHidden = overlaydiv.hidden;
      overlaydiv.hidden = !isHidden;
    });
  };

  edit = async (uuid, content, styleclasses) => {
    const overlay = this.store[uuid];
    const overlayDiv = overlay
      ? document.querySelector(`#${overlay.selector}`)
      : document.querySelector(`#${this.WIDGET_NAME}${uuid}`);
    if (overlayDiv) {
      await store.dispatch(
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
      Object.keys(this.store).map((ol) => {
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
