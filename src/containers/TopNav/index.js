import React from "react";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../utils/logs";
import { InitTools } from "../../redux/actions/tools";
import { toogleSideNav } from "../../redux/actions/ui";
import Tool from "../../components/tool";
class TopNav extends React.Component {
  componentDidMount() {
    LogIt(logLevel.INFO, "TopNav init");
    this.props.InitTools(config.get("tools"));
  }
  renderTools = (tools) => {
    return tools ? (
      <React.Fragment>
        {Object.keys(tools).map((toolId) => (
          <Tool key={toolId} ToolID={toolId} />
        ))}
      </React.Fragment>
    ) : null;
  };

  render() {
    return (
      <div className="ui top fixed menu ">
        {this.renderTools(this.props.Tools)}
        <div className="item align left">
          <div className="ui icon input">
            <input type="text" placeholder="...חיפוש" />
            <i className="search link icon"></i>
          </div>
        </div>
        <a className="fixed item" onClick={() => this.props.toogleSideNav()}>
          Layers
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { InitTools, toogleSideNav })(TopNav);
