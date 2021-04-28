import React, { Component } from "react";
import Table from "../../../UI/Table";
import { GeoserverUtil } from "../../../../utils/Geoserver";
import { connect } from "react-redux";
import { selectCurrentMapLayers } from "../../../../state/reducers";
class TableOfFeature extends Component {
  WIDGET_NAME = "EditTool";

  state = { data: [] };

  generateColumns = () => {
    debugger;
    this.columns = this.metadata.featureTypes[0].properties
      .map((prop) => {
        if (!prop.type.includes("gml")) {
          return {
            Header: prop.name,
            accessor: prop.name,
          };
        }
      })
      .filter((f) => f !== undefined);
  };

  getdata = async () => {
    this.metadata = await this.geoserverUtil.getWFSMetadata();
    this.generateColumns();
    const data = await this.geoserverUtil.getAllFeatures();
    this.setState({ data });
  };

  initTable = () => {
    this.updateLayer();
    this.getdata();
  };

  componentDidMount() {
    this.initTable();
  }

  updateLayer() {
    const layer = this.props.Layers[this.props.uuid];
    const workspace = layer.workspace;
    const layername = layer.restid;
    this.geoserverUtil = new GeoserverUtil(workspace, layername);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uuid !== this.props.uuid) {
      this.initTable();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.data.length > 0 && this.columns && (
          <Table
            data={this.state.data}
            columns={this.columns}
            uuid={this.props.uuid}
          />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: selectCurrentMapLayers(state),
  };
};

export default connect(mapStateToProps)(TableOfFeature);
