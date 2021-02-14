import React from "react";
import MapTabs from "./containers/MapTabs/MapTabs";
import Map from "./containers/Map/Map";
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
import { toggleToolByName } from "./redux/actions/tools";
import { InitSearching } from "./utils/searchUtils";
import Widget from "./containers/Widget";
import { ToastProvider } from 'react-toast-notifications'
// REMOVE: this is just for searching debug
import NessSearching from "./searches/searches";
import { getFocusedMapProxy } from "./nessMapping/api";
// import "./style.css";



class App extends React.Component {
  bootstrap = async () => {
    await this.props.InitRasters();
    await this.props.InitMap();
    await this.props.InitTools(config.get("Widgets"));
    await this.props.InitLayers();
  };

  componentDidMount() {



    LogIt(logLevel.INFO, "App init");

    InitIcons();
    this.bootstrap();

    InitSearching(config.get("SearchConfigs"));

    // REMOVE: this is just for searching debug
    NessSearching.getInstance()
      .InitSearch("כיתה")
      .then((menuItems) => {
        console.log("memu: ");
        menuItems.forEach((menuItem) => {
          console.log(
            "  --menuItem: " +
            menuItem.title +
            " " +
            JSON.stringify(menuItem.item)
          );
        });

        if (menuItems.length > 0) {
          console.log("invoking first item...");
          menuItems[0].invoker.apply(this, [menuItems[0]]);
        }
      });
    // REMOVE: this is just for searching debug
  }



  render() {
    const currentMapId = getFocusedMapProxy() ? getFocusedMapProxy().uuid.value : null;

    return (
      <React.Fragment>
        <ToastProvider placement="bottom-left">
          <div class="app">
            <div className="app__side">
              <TopNav onLayerMenuOpen={this.onLayerMenuOpen} />
              <div id="app-side-content-container" className="app-side-content-container"></div>
            </div>
            <div className="app__main">
              {currentMapId && <React.Fragment><MapTabs /><Map /></React.Fragment>}
            </div>
          </div>
        </ToastProvider>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <ToastProvider placement="bottom-left">
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
          <div id="append-element-sideNav" className="append-element-sideNav"></div>
          <div id="append-element-container" className="append-element-container"></div>
          <Widget />
        </ToastProvider>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return { maps: state.map };
};

export default connect(mapStateToProps, {
  InitTools,
  InitLayers,
  InitRasters,
  InitMap,
  toggleToolByName
})(App);
