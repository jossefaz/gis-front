import React from 'react';
import Map from "../containers/Map";
import TopNav from "../containers/TopNav";
import SideNav from "../containers/SideNav";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../utils/logs";
import { InitTools } from "../redux/actions/tools";
import { connect } from "react-redux";
import { InitLayers } from "../redux/actions/layers";
import { InitRasters } from "../redux/actions/raster";
class App extends React.Component {
  componentDidMount() {
    LogIt(logLevel.INFO, "App init");
    this.props.InitLayers(config.get("layers"));
    this.props.InitRasters();
    this.props.InitTools(config.get("Widgets"));
  }
  render() {
    return (
      <SideNav>
        <div className="ui grid">
          <div className="row">
            <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
          </div>
          <div className="row">
            <Map />
          </div>
        </div>
      </SideNav>
    );
  }
}
const mapStateToProps = (state) => {
  return { Tools: state.Tools };
};
export default connect(mapStateToProps, { InitTools, InitLayers, InitRasters })(App);


