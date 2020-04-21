import React from "react";
import { connect } from "react-redux";
import { toggleTool } from "../../../redux/actions/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class Loader extends React.Component {
  render() {
    const { ToolName, ToolImage, ToolIcon } = this.props.Tools.tools[
      this.props.ToolID
    ];
    const CloseCB = () => this.props.toggleTool(this.props.ToolID);
    return (
      <a className="item" onClick={CloseCB}>
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
