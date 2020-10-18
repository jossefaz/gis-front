import React from "react";
import MapTabs from "./containers/MapTabs";
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
import { getMetaData } from "./communication/mdFetcher";
import { InitSearching } from "./utils/searchUtils";
import Widget from "./containers/Widget";

// REMOVE: this is just for searching debug
import NessSearching from "./searches/searches";
// REMOVE: this is just for searching debug

class App extends React.Component {

  bootstrap = async () => {
    await this.props.InitRasters();
    await this.props.InitMap();
    await this.props.InitTools(config.get("Widgets"));

  }

  componentDidMount() {
    LogIt(logLevel.INFO, "App init");

    InitIcons();
    this.bootstrap()




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

    this.fetchDataFromServer();
  }



  fetchDataFromServer = async () => {
    const [layersResult] = await Promise.all([getMetaData("layers")]);
    if (layersResult) {
      this.props.InitLayers(layersResult);
    }
  };

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
  return { maps: state.map };
};

export default connect(mapStateToProps, {
  InitTools,
  InitLayers,
  InitRasters,
  InitMap,
})(App);
