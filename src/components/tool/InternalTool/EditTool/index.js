import React, { Component } from "react";
import { initVectorLayers, getWFSMetadata } from "../../../../utils/features";
import EditProxy from "../../../../nessMapping/EditProxy";
import { InteractionUtil } from "../../../../utils/interactions";
export default class EditTool extends Component {
  state = {
    geomType: null,
  };
  WIDGET_NAME = "EditTool";

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
  }

  onAddFeature = async () => {
    await this.interactions.newDraw({ type: this.state.geomType });
  };

  getMetadata = async () => {
    this.metadata = await getWFSMetadata(this.props.ref_name);
    this.setState({
      geomType: this.metadata.featureTypes[0].properties[0].localType,
    });
  };

  componentDidMount() {
    initVectorLayers([this.props.ref_name]);
    this.editProxy = EditProxy.getInstance([this.props.ref_name]);
    this.getMetadata();
  }
  render() {
    return (
      <React.Fragment>
        <button onClick={this.onAddFeature}>add feature</button>
      </React.Fragment>
    );
  }
}
