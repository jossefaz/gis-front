import React from 'react';
import MapTabs from "./containers/MapTabs";
import Map from "./components/Map";
import TopNav from "./containers/TopNav";
import SideNav from "./containers/SideNav";
import config from "react-global-configuration";
import { logLevel, LogIt } from "./utils/logs";
import { InitTools } from "./redux/actions/tools";
import { connect } from "react-redux";
import { InitMap } from "./redux/actions/map";
import { InitLayers } from "./redux/actions/layers";
import { InitRasters } from "./redux/actions/raster";
import { InitIcons } from "./utils/faicons";
import { InitSearches } from "./utils/searchUtils";
import Widget from './containers/Widget';


class App extends React.Component {
  componentDidMount() {

    LogIt(logLevel.INFO, "App init");

    InitIcons();
    
    this.props.InitMap();
    this.props.InitLayers(config.get("layers"));
    this.props.InitRasters();
    this.props.InitTools(config.get("Widgets"));

    InitSearches(config.get("SearchConfigs"));
  }

  render() {
    return (
      <React.Fragment>
        <SideNav>
          <div className="ui grid">
            <div className="row">
              <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
            </div>
            <div className="row">
              <MapTabs />
              <Map />
            </div>
          </div>
        </SideNav>
        <Widget />
      </React.Fragment>

    );
  }
}
const mapStateToProps = (state) => {
  return { Tools: state.Tools, maps: state.map };
};
export default connect(mapStateToProps, { InitTools, InitLayers, InitRasters, InitMap })(App);
