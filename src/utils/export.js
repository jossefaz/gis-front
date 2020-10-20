import { jsPDF } from "jspdf";
import { NewCanvas } from "./html";

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

export const getCurrentMapCanvas = (width, height) => {
  const mapCanvas = NewCanvas(width, height);
  const mapContext = mapCanvas.getContext("2d");
  Array.prototype.map.call(
    // select all DOM elements with the class .ol-layer canvas and loop through the array of elelments returned
    // because the queryselector will return a NodeList, thus we need tu use the Array.prototyp.map.call on it,
    // otherwise we cannot loop through the nodelist
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
      }
    }
  );
  return mapCanvas;
};
