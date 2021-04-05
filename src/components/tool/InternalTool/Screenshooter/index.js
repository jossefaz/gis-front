import React from "react";
import { Dropdown } from "semantic-ui-react";
import { Button, Icon } from "semantic-ui-react";
import {
  exportImageToPdf,
  ORIENTATION,
  saveCanvasAsImage,
  dims,
  MapImage,
  copyCanvasToClipBoard,
} from "../../../../utils/export";
import "./style.css";
import { isChrome, isEdge, isOpera } from "../../../../utils/browserDetector";
import withNotifications from "../../../HOC/withNotifications";

const formatOptions = [
  { key: "a0", value: "a0", text: "A0" },
  { key: "a1", value: "a1", text: "A1" },
  { key: "a2", value: "a2", text: "A2" },
  { key: "a3", value: "a3", text: "A3" },
  { key: "a4", value: "a4", text: "A4" },
];

const resolutionOptions = [
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
    fileFormat: "pdf",
    resolution: "150",
  };

  handleResolutionChange = (newResolution) => {
    this.mapimpage.resolution = newResolution;
    this.setState({ resolution: newResolution });
  };

  handleFileFormatChange = (newFileFormat) => {
    this.setState({ fileFormat: newFileFormat });
  };

  handleFormatChange = (newFormat) => {
    this.mapimpage.dim = dims[newFormat];
    this.setState({ format: newFormat });
  };

  componentDidMount() {
    this.mapimpage = new MapImage();
    this.mapimpage.resolution = this.state.resolution;
  }

  save = (copy) => {
    this.mapimpage.createMapCanvas((canvas) => {
      if (copy) {
        copyCanvasToClipBoard(canvas);
        this.props.addToast("Copied to clipboard !", {
          appearance: "success",
          autoDismiss: true,
        });
      } else if (this.state.fileFormat === "pdf") {
        exportImageToPdf(
          canvas,
          "map",
          ORIENTATION.landscape,
          this.mapimpage.format,
          this.mapimpage.dim[0],
          this.mapimpage.dim[1]
        );
      } else {
        saveCanvasAsImage(canvas, "map", this.state.fileFormat);
      }
    });
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
          <Button icon onClick={() => this.save(false)}>
            <Icon name="save" />
          </Button>
          {(isChrome || isEdge || isOpera) && (
            <Button icon onClick={() => this.save(true)}>
              <Icon name="copy" />
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withNotifications(Exporter);
