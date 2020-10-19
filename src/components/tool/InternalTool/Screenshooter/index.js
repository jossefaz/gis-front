import React from "react";
import { jsPDF } from "jspdf";
import { getFocusedMap } from "../../../../nessMapping/api";

const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};
class Exporter extends React.Component {
  export = () => {
    document.body.style.cursor = "progress";

    var format = document.getElementById("format").value;
    var resolution = document.getElementById("resolution").value;
    var dim = dims[format];
    var width = Math.round((dim[0] * resolution) / 25.4);
    var height = Math.round((dim[1] * resolution) / 25.4);
    var size = getFocusedMap().getSize();
    var viewResolution = getFocusedMap().getView().getResolution();

    getFocusedMap().once("rendercomplete", function () {
      var mapCanvas = document.createElement("canvas");
      mapCanvas.width = width;
      mapCanvas.height = height;
      var mapContext = mapCanvas.getContext("2d");
      Array.prototype.forEach.call(
        document.querySelectorAll(".ol-layer canvas"),
        function (canvas) {
          if (canvas.width > 0) {
            var opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            var transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            var matrix = transform
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
      var pdf = new jsPDF("landscape", undefined, format);
      pdf.addImage(
        mapCanvas.toDataURL("image/jpeg"),
        "JPEG",
        0,
        0,
        dim[0],
        dim[1]
      );
      pdf.save("map.pdf");
      // Reset original map size
      getFocusedMap().setSize(size);
      getFocusedMap().getView().setResolution(viewResolution);
      document.body.style.cursor = "auto";
    });

    // Set print size
    var printSize = [width, height];
    getFocusedMap().setSize(printSize);
    var scaling = Math.min(width / size[0], height / size[1]);
    getFocusedMap()
      .getView()
      .setResolution(viewResolution / scaling);
  };

  render() {
    return (
      <React.Fragment>
        <form class="form">
          <label>Page size </label>
          <select id="format">
            <option value="a0">A0 (slow)</option>
            <option value="a1">A1</option>
            <option value="a2">A2</option>
            <option value="a3">A3</option>
            <option value="a4" selected>
              A4
            </option>
            <option value="a5">A5 (fast)</option>
          </select>
          <label>Resolution </label>
          <select id="resolution">
            <option value="72">72 dpi (fast)</option>
            <option value="150">150 dpi</option>
            <option value="300">300 dpi (slow)</option>
          </select>
        </form>
        <button id="export-pdf" onClick={this.export}>
          Export PDF
        </button>
      </React.Fragment>
    );
  }
}

export default Exporter;
