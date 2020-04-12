import React from "react";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../utils/logs";
import { InitTools } from "../../redux/actions/tools";
import Tool from "../../components/tool";
class TopNav extends React.Component {
  componentDidMount() {
    LogIt(logLevel.INFO, "TopNav init");
    this.props.InitTools(config.get("Tools"));
  }

  render() {
    return (
      <div className="ui top fixed menu ">
        {Object.keys(this.props.Tools).map((toolId) => (
          <Tool ToolID={toolId} />
        ))}
        <div className="item align left">
          <div className="ui icon input">
            <input type="text" placeholder="...חיפוש" />
            <i className="search link icon"></i>
          </div>
        </div>
        <a className="fixed item" onClick={() => this.props.onLayerMenuOpen()}>
          Layers
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { InitTools })(TopNav);
