import React, { useEffect } from "react";
import API from "../../core/api";
import MapTabs from "../MapTabs/MapTabs";
import Map from "../Map/Map";
import MapMenu from "../../components/MapMenu";
import TopNav from "../TopNav";
import SideNav from "../SideNav";
import config from "../../configuration";
import { InitIcons } from "../../utils/faicons";
import WidgetFixContainer from "../Widget/StickyToolContainer";
import WidgetMapContainer from "../Widget/DynamicToolContainer";
import { ToastProvider } from "react-toast-notifications";
// import "../../style.css";
import Props from "./props";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC<Props> = (props) => {
  const { InitLayers, InitMap, InitRasters, InitTools, mapState } = props;

  const bootstrap = () => {
    InitRasters();
    InitMap();
    InitTools(config().Widgets);
    InitLayers();
  };

  useEffect(() => {
    bootstrap();
    InitIcons();
  }, []);

  const mapId = API.map.getFocusedMapProxy() ? API.map.getFocusedMapProxy().uuid.value : null;  
  
  return (
    mapState && (
      <React.Fragment>
        <ToastProvider placement="bottom-left">
          <DndProvider backend={HTML5Backend}>
            <div className="app">
              <div className="app__side">
                {mapId && <TopNav/>}
                <WidgetFixContainer />
                <div id="app-side-content-container" className="app-side-content-container"></div>
              </div>
              <div className="app__main">
                {mapId ? <React.Fragment>
                  <MapTabs />
                  <Map />
                  <MapMenu />
                </React.Fragment> : null }
              </div>
            </div>
            <WidgetMapContainer />
          </DndProvider>
        </ToastProvider>
      </React.Fragment>
    )
  );


  return (
    mapState && (
      <React.Fragment>
        <ToastProvider placement="bottom-left">
          <DndProvider backend={HTML5Backend}>
            <SideNav>
              <div className="ui grid">
                <div className="row">
                  <TopNav />
                </div>
                <div className="row">
                  <MapTabs />
                  <Map />
                </div>
              </div>
            </SideNav>
            <div
              id="append-element-sideNav"
              className="append-element-sideNav"
            ></div>
            <div
              id="append-element-container"
              className="append-element-container"
            ></div>
            <WidgetFixContainer />
            <WidgetMapContainer />
          </DndProvider>
        </ToastProvider>
      </React.Fragment>
    )
  );
};

export default App;
