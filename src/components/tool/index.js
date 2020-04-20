import React, { Suspense } from "react";
import { connect } from "react-redux";
import { toggleTool, setToolFocused } from "../../redux/actions/tools";
import ToolTemplate from "./Template";
import ExternalTool from "./ExternalTool";
import InternalTool from "./InternalTool";
class Loader extends React.Component {
  render() {
    const { ToolInvokerType, ToolName, ToolLocation } = this.props.Tools.tools[
      this.props.ToolID
    ];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    const FocusMe = () => this.props.setToolFocused(this.props.ToolID);
    const focused = this.props.Tools.order[0] == this.props.ToolID;
    return (
      <React.Fragment>
        {ToolInvokerType ? (
          <ToolTemplate
            CloseTool={CloseCB}
            focused={focused}
            toolName={ToolName}
            FocusMe={FocusMe}
          >
            <ExternalTool url={ToolLocation} />
          </ToolTemplate>
        ) : (
          <ToolTemplate
            CloseTool={CloseCB}
            focused={focused}
            toolName={ToolName}
            FocusMe={FocusMe}
          >
            <Suspense fallback={<div>Loading ...</div>}>
              <InternalTool toolName={ToolName} />
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
