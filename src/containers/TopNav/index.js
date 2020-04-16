import React from "react";
import { connect } from "react-redux";
import { toogleSideNav } from "../../redux/actions/ui";
import Tool from "../../components/tool";
class TopNav extends React.Component {
  renderTools = (tools) => {
    return tools ? (
      <React.Fragment>
        {Object.keys(tools.tools).map((toolId) => (
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
        <a
          className="ui fixed item image pointerCursor"
          onClick={() => this.props.toogleSideNav()}
        >
          <img src={`/img/Layers.png`} />
        </a>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { toogleSideNav })(TopNav);
