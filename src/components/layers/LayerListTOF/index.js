import React from "react";
import { GenerateUUID } from "../../../utils/uuid";
import AppendBodyComponent from "../../HOC/appendBodyElement";
import TableOfFeatures from "../../tool/InternalTool/TableOfFeatures";
import { connect } from "react-redux";

class LayerListTOF extends AppendBodyComponent {
  WIDGET_NAME = "LayerListTOF";

  constructor() {
    super("append-element-sideNav");
    this.uniqueId = `LayerListTOF_${GenerateUUID()}`;
    this.setAppendElementId(this.uniqueId);
  }

  // this.removeAppendElement();

  generateTable = () => {
    this.props.uuid &&
      this.updateAppendElement(
        <TableOfFeatures uuid={this.props.uuid} key="TOF-div" />
      );
  };

  componentDidMount() {
    this.generateTable();
  }

  componentDidUpdate() {
    if (!this.props.openTable) {
      this.removeAppendElement();
    } else {
      this.generateTable();
    }
  }
  componentWillUnmount() {
    this.removeAppendElement();
  }

  render() {
    return null;
  }
}
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(LayerListTOF);
