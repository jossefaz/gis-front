import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class Loader extends React.Component {
  render() {
    const { ToolName, ToolImage, ToolIcon } = this.props.Tools.tools[
      this.props.ToolID
    ];
    const ToggleCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <a className="item" onClick={ToggleCB}>
        {ToolIcon ? (
          <FontAwesomeIcon icon={ToolIcon} size="2x" />
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
