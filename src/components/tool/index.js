import React, { Suspense } from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../redux/actions/tools";
import ToolTemplate from "./Template";
import ExternalTool from "./ExternalTool";
import InternalTool from "./InternalTool";
class Loader extends React.Component {
  render() {
    const { ToolInvokerType, ToolName, ToolLocation } = this.props.Tools.tools[
      this.props.ToolID
    ];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <React.Fragment>
        {ToolInvokerType ? (
          <ToolTemplate CloseTool={CloseCB}>
            <ExternalTool url={ToolLocation} />
          </ToolTemplate>
        ) : (
          <ToolTemplate CloseTool={CloseCB}>
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

export default connect(mapStateToProps, { toggleTool })(Loader);
