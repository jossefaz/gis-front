import React from "react";
import { getFocusedMap } from "../../../../nessMapping/api";
import { Dropdown } from "semantic-ui-react";
import { Button, Icon } from "semantic-ui-react";
import {
  exportImageToPdf,
  ORIENTATION,
  getCurrentMapCanvas,
  saveCanvasAsImage,
} from "../../../../utils/export";
import "./style.css";
const dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

const formatOptions = [
  { key: "a0", value: "a0", text: "A0" },
  { key: "a1", value: "a1", text: "A1" },
  { key: "a2", value: "a2", text: "A2" },
  { key: "a3", value: "a3", text: "A3" },
  { key: "a4", value: "a4", text: "A4" },
];

const resolutionOptions = [
  { key: "72", value: "72", text: "72 dpi (מהר)" },
  { key: "150", value: "150", text: "150 dpi" },
  { key: "300", value: "300", text: "300 dpi (עיטי)" },
  { key: "600", value: "600", text: "600 dpi (עיטי)" },
];

const fileFormatOptions = [
  { key: "pdf", value: "pdf", text: "PDF" },
  { key: "png", value: "png", text: "PNG" },
];

class Exporter extends React.Component {
  state = {
    format: "a4",
    resolution: "72",
    dim: dims["a4"],
    fileFormat: "pdf",
  };

  handleResolutionChange = (newResolution) => {
    this.setState({ resolution: newResolution });
  };

  handleFileFormatChange = (newFileFormat) => {
    this.setState({ fileFormat: newFileFormat });
  };

  handleFormatChange = (newFormat) => {
    this.setState({ format: newFormat, dim: dims[newFormat] });
  };

  get width() {
    return Math.round((this.state.dim[0] * this.state.resolution) / 25.4);
  }

  get height() {
    return Math.round((this.state.dim[1] * this.state.resolution) / 25.4);
  }

  save = () => {
    document.body.style.cursor = "progress";
    const size = getFocusedMap().getSize();
    const viewResolution = getFocusedMap().getView().getResolution();
    this.resizeMapForExporting(size, viewResolution);
    getFocusedMap().once("rendercomplete", () => {
      getCurrentMapCanvas(this.width, this.height).then((mapCanvas) => {
        if (this.state.fileFormat == "pdf") {
          exportImageToPdf(
            mapCanvas,
            "map",
            ORIENTATION.landscape,
            this.state.format,
            this.state.dim[0],
            this.state.dim[1]
          );
        } else {
          saveCanvasAsImage(mapCanvas, "map", this.state.fileFormat);
        }
        this.resetSizeAfterExport(size, viewResolution);
      });
    });
  };

  resizeMapForExporting = (originalSize, originalResolution) => {
    // Set print size
    var printSize = [this.width, this.height];
    getFocusedMap().setSize(printSize);
    var scaling = Math.min(
      this.width / originalSize[0],
      this.height / originalSize[1]
    );
    getFocusedMap()
      .getView()
      .setResolution(originalResolution / scaling);
  };

  resetSizeAfterExport = (originalSize, originalResolution) => {
    // Reset original map size
    getFocusedMap().setSize(originalSize);
    getFocusedMap().getView().setResolution(originalResolution);
    document.body.style.cursor = "auto";
  };

  render() {
    return (
      <React.Fragment>
        <div className="gridDisplay">
          <Dropdown
            button
            className="icon"
            labeled
            icon="file"
            options={formatOptions}
            defaultValue={this.state.format}
            onChange={(v, { value }) => this.handleFormatChange(value)}
          />
          <Dropdown
            button
            className="icon"
            labeled
            icon="chess board"
            options={resolutionOptions}
            defaultValue={this.state.resolution}
            onChange={(v, { value }) => this.handleResolutionChange(value)}
          />

          <Dropdown
            button
            className="icon"
            labeled
            icon="file image"
            options={fileFormatOptions}
            defaultValue={this.state.fileFormat}
            onChange={(v, { value }) => this.handleFileFormatChange(value)}
          />
          <Button icon onClick={this.save}>
            <Icon name="save" />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default Exporter;
