import { jsPDF } from "jspdf";
import { NewCanvas } from "./html";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { getFocusedMap } from "../nessMapping/api";
export const ORIENTATION = {
  portrait: "portrait",
  landscape: "landscape",
};

export const exportImageToPdf = (
  canvas,
  filename,
  orientation,
  format,
  width,
  height
) => {
  var pdf = new jsPDF(orientation, undefined, format);
  let image;
  try {
    image = canvas.toDataURL("image/jpeg");
  } catch (error) {
    console.log("conversion of a given canvas to Data URL image failed");
    return;
  }
  pdf.addImage(image, "JPEG", 0, 0, width, height);
  pdf.save(`${filename}.pdf`);
};

export const saveCanvasAsImage = (canvas, title, format) => {
  canvas.toBlob(function (blob) {
    saveAs(blob, `${title}.${format}`);
  });
};

export const copyCanvasToClipBoard = (canvas) => {
  canvas.toBlob((blob) =>
    navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })])
  );
};



export const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};



export class MapImage {
  constructor() {
      this.format = "a4";
      this.dim = dims["a4"];
      this._mapCanvas = null
  }


  get width() {
    return Math.round((this.dim[0] * this.resolution) / 25.4);
  }

  get height() {
    return Math.round((this.dim[1] * this.resolution) / 25.4);
  }

  get size() {
    return this._size;
  }

  get resolution() {
    return this._resolution;
  }

  set size(size) {
    this._size = size
  }
  set resolution(resolution) {
    this._resolution = resolution
  }

  setResolution(newResolution){
    this.resolution = newResolution
  }




  resetSizeAfterExport = () => {
    // Reset original map size
    getFocusedMap().setSize(this.size);
    getFocusedMap().getView().setResolution(this.saved_resolution);
    document.body.style.cursor = "auto";
    
  };
  createMapCanvas = async (cb) => {
      document.body.style.cursor = "progress";
      this.size = getFocusedMap().getSize();
      this.saved_resolution = getFocusedMap().getView().getResolution();
      this.resizeMapForExporting();
      await getFocusedMap().once("rendercomplete", async ()=>{

        this._mapCanvas = await this.getCurrentMapCanvas()
        this.resetSizeAfterExport();
        cb(this._mapCanvas)
      })
  }




  resizeMapForExporting = () => {
    getFocusedMap().setSize([this.width, this.height]);
    var scaling = Math.min(
      this.width / this.size[0],
      this.height / this.size[1]
    );
    getFocusedMap()
      .getView()
      .setResolution(this.saved_resolution / scaling);
  };

  getCurrentMapCanvas = async () => {
    const overlaycanva = await html2canvas(
      [...document.querySelectorAll(".ol-overlaycontainer")][0],
      {
        backgroundColor: null,
      }
    );
    const mapCanvas = NewCanvas(this.width, this.height);
    const mapContext = mapCanvas.getContext("2d");
    Array.prototype.map.call(
      document.querySelectorAll(".ol-layer canvas"),
      (canvas) => {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
          // Get the transform parameters from the style's transform matrix
          const matrix = canvas.style.transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(",")
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          mapContext.drawImage(canvas, 0, 0);
          mapContext.drawImage(overlaycanva, 0, 0);
        }
      }
    );
    return mapCanvas;
  };
}