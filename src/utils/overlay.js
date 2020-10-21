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
  setOverlayProperty,
  setOverlay,
} from "../redux/actions/overlay";
import store from "../redux/store";

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
  static generateTextOverlay = (selector, classes, text, widgetName) => {
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

  get store() {
    const currentOverlayStore = store.getState().Overlays;
    if (
      this.widget in currentOverlayStore &&
      this.currentMapUUID in currentOverlayStore[this.widget]
    ) {
      return currentOverlayStore[this.widget][this.currentMapUUID];
    }
    return false;
  }
  get currentMapUUID() {
    return getFocusedMapProxy().uuid.value;
  }

  newText = async (text) => {
    const selector = `${this.widget}${this.currentMapUUID}`;
    await store.dispatch(
      setOverlay(
        OverlayUtil.generateTextOverlay(
          selector,
          this.CLASSNAMES.TEXT,
          text,
          this.widget
        )
      )
    );
    const currentOverlays = Object.keys(this.store.overlays);
    const lastID = currentOverlays[currentOverlays.length - 1];
    return lastID;
  };

  addToMap = (uuid) => {
    const overlay = getOverlay(uuid);
    overlay.setPosition(getFocusedMap().getView().getCenter());
  };

  addDraggable = (uuid) => {
    const overlay = this.store.overlays[uuid];
    const overlayDiv = document.getElementById(overlay.selector);
    overlayDiv.setAttribute("uuid", uuid);
    overlayDiv.setAttribute("dragging", false);
    const that = this;
    overlayDiv.addEventListener("mousedown", function (evt) {
      getOverlay(this.id.split(that.widget)[1]).set("dragging", true);
    });
  };

  unset = async (uuid) => {
    await store.dispatch(unsetOverlay({ uuid, widgetName: this.widget }));
  };

  testIt = () => {
    console.log("*****FIRST TEST***");
    console.log(this.widget);
    console.log(this.store);
    console.log("*****END TEST***");
  };

  dragOverlay = (evt, cb) => {
    if (this.store) {
      Object.keys(this.store.overlays).map((ol) => {
        const overlay = getOverlay(ol);
        if (overlay.get("dragging")) {
          cb();
          overlay.setPosition(evt.coordinate);
        }
      });
    }
  };

  edit = async (content, uuid) => {
    const overlay = this.store.overlays[uuid];
    const overlayDiv = document.querySelector(`#${overlay.selector}`);
    await store.dispatch(
      setOverlayProperty({
        widgetName: this.widget,
        uuid,
        property: "content",
        value: content,
      })
    );
    overlayDiv.innerHTML = content;
  };

  unDragOverlay = (cb) => {
    if (this.store) {
      Object.keys(this.store.overlays).map((ol) => {
        if (getOverlay(ol).get("dragging")) {
          cb();
          getOverlay(ol).set("dragging", false);
        }
      });
    }
  };
}
