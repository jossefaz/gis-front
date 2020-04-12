import React, { lazy } from "react";
import Iframe from "react-iframe";
import { connect } from "react-redux";
import { toggleTool } from "../../redux/actions/tools";
import PopUp from "../popup";
class Loader extends React.Component {
  componentDidMount() {
    window.addEventListener("message", (e) => {
      e.stopPropagation();
      console.log(e);
    });
  }

  render() {
    const {
      IsOpen,
      ToolInvokerType,
      ToolLocation,
      ToolName,
    } = this.props.Tools[this.props.ToolID];
    const InternalTool = !ToolInvokerType
      ? lazy(() => import(ToolLocation))
      : null;
    return (
      <div>
        <button onClick={() => this.props.toggleTool(this.props.ToolID)}>
          {ToolName}
        </button>
        {IsOpen ? (
          ToolInvokerType ? (
            <PopUp>
              <Iframe url={ToolLocation} />
            </PopUp>
          ) : (
            <PopUp>
              <InternalTool />
            </PopUp>
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
