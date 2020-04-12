import React from "react";
import { connect } from "react-redux";
import { InitTools } from "../../redux/actions/tools";
class TopNav extends React.Component {
  componentDidMount() {
    LogIt(logLevel.INFO, "TopNav init");
    this.props.InitTools(config.get("Tools"));
  }

  render() {
    return (
      <div className="ui top fixed menu ">
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
export default connect(null, { InitTools })(TopNav);
