import React, { Component } from "react";
import { initVectorLayers, getWFSMetadata } from "../../../../utils/features";
import EditProxy from "../../../../nessMapping/EditProxy";
import { InteractionUtil } from "../../../../utils/interactions";
import Form from "../../../UI/Form";
import withNotifications from "../../../HOC/withNotifications";
import EditForm from "./EditForm";
class EditTool extends Component {
  state = {
    geomType: null,
    openForm: false,
    newFeature: null,
    fields: null,
  };
  WIDGET_NAME = "EditTool";

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
  }

  onAddFeature = async () => {
    await this.interactions.newDraw({ type: this.state.geomType });
    this.onDrawEnd();
  };

  getMetadata = async () => {
    this.metadata = await getWFSMetadata(this.props.ref_name);
    this.setState({
      geomType: this.metadata.featureTypes[0].properties[0].localType,
      fields: this.metadata.featureTypes[0].properties,
    });
  };

  onDrawEnd = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.on("drawend", async (e) => {
        this.setState({
          newFeature: e.feature,
          openForm: true,
        });
        this.interactions.currentDraw.abortDrawing();
      });
    }
  };

  onSubmit = async (data) => {
    this.interactions.getVectorSource(this.interactions.TYPES.DRAW).clear();
    this.interactions.unDraw();
    this.setState({ newFeature: null, openForm: false });
  };

  componentDidMount() {
    initVectorLayers([this.props.ref_name]);
    this.editProxy = EditProxy.getInstance([this.props.ref_name]);
    this.getMetadata();
  }
  render() {
    return (
      <React.Fragment>
        {this.state.openForm && (
          <EditForm
            fields={this.state.fields}
            feature={this.state.newFeature}
            onSubmit={this.onSubmit}
            editProxy={this.editProxy[this.props.ref_name]}
          />
        )}
        <button onClick={this.onAddFeature}>add feature</button>
      </React.Fragment>
    );
  }
}

export default EditTool;
