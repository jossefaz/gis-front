import React, { Suspense } from "react";
import { connect } from "react-redux";
import { toggleTool, setToolFocused } from "../../state/actions";
import API from "../../core/api";
import ToolTemplate from "./Template";
import ExternalTool from "./ExternalTool";
import InternalTool from "./InternalTool";
const { getFocusedMapProxy } = API.map;
class Loader extends React.Component {
  get Tools() {
    const currentMapId = getFocusedMapProxy()
      ? getFocusedMapProxy().uuid.value
      : null;
    return currentMapId ? this.props.Tools[currentMapId] : null;
  }
  render() {
    const { ToolInvokerType, ToolName, ToolLocation } = this.Tools.tools[
      this.props.ToolID
    ];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    const FocusMe = () => this.props.setToolFocused(this.props.ToolID);
    const focused = this.Tools.order[0] == this.props.ToolID;
    return (
      <React.Fragment>
        {ToolInvokerType ? (
          <ToolTemplate
            CloseTool={CloseCB}
            focused={focused}
            toolName={ToolName}
            FocusMe={FocusMe}
          >
            <ExternalTool url={ToolLocation} toolID={this.props.ToolID} />
          </ToolTemplate>
        ) : (
          <ToolTemplate
            CloseTool={CloseCB}
            focused={focused}
            toolName={ToolName}
            FocusMe={FocusMe}
          >
            <Suspense fallback={<div>Loading ...</div>}>
              <InternalTool toolName={ToolName} toolID={this.props.ToolID} />
            </Suspense>
          </ToolTemplate>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool, setToolFocused })(Loader);
