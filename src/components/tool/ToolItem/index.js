import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LifeCycleRegistry from "../ToolLifeCycle";
class Loader extends React.Component {
  render() {
    const {
      ToolName,
      ToolImage,
      ToolIcon,
      IsOpen,
      OnCreate,
      OnDestroy,
    } = this.props.Tools.tools[this.props.ToolID];
    const LifeCycle = IsOpen
      ? LifeCycleRegistry[OnDestroy]
      : LifeCycleRegistry[OnCreate];
    const ToggleCB = () => this.props.toggleTool(this.props.ToolID, LifeCycle);
    return (
      <a className="item" onClick={ToggleCB}>
        {ToolIcon ? (
          <FontAwesomeIcon icon={ToolIcon} size="lg" />
        ) : ToolImage ? (
          <img src={`/img/${ToolImage}`} />
        ) : (
          ToolName
        )}
      </a>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};

export default connect(mapStateToProps, { toggleTool })(Loader);
