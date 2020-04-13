import React, { Suspense } from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../redux/actions/tools";
import ToolTemplate from "./Template";
import ExternalTool from "./ExternalTool";
import InternalTool from "./InternalTool";
class Loader extends React.Component {
  componentDidMount() {
    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") {
        console.log(e);
        return;
      }
    });
  }

  render() {
    const {
      IsOpen,
      ToolInvokerType,
      ToolName,
      ToolLocation,
    } = this.props.Tools[this.props.ToolID];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <div>
        <button onClick={CloseCB}>{ToolName}</button>
        {IsOpen ? (
          ToolInvokerType ? (
            <ToolTemplate CloseTool={CloseCB}>
              <ExternalTool url={ToolLocation} />
            </ToolTemplate>
          ) : (
            <ToolTemplate CloseTool={CloseCB}>
              <Suspense fallback={<div>Loading ...</div>}>
                <InternalTool toolName={ToolName} />
              </Suspense>
            </ToolTemplate>
          )
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
