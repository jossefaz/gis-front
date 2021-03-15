import React, { useEffect } from "react";
import MapTabs from "../../components/MapTabs/MapTabs";
import Map from "../Map/Map";
import TopNav from "../TopNav";
import SideNav from "../SideNav";
import config from "../../configuration";
import { InitIcons } from "../../utils/faicons";
import WidgetFixContainer from "../Widget/StickyToolContainer";
import WidgetMapContainer from "../Widget/DynamicToolContainer";
import { ToastProvider } from "react-toast-notifications";
import "../../style.css";
import Props from "./props";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { selectFocusedMapTools } from "../../state/reducers";
import { useTypedSelector } from "../../hooks/useTypedSelectors";

const App: React.FC<Props> = (props) => {
  const { InitLayers, InitMap, InitRasters, InitTools, mapState } = props;
  const Tools = useTypedSelector(selectFocusedMapTools)
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

  return (
    mapState && (
      <React.Fragment>
        <ToastProvider placement="bottom-left">
          <DndProvider backend={HTML5Backend}>
            <SideNav>
              <div className="ui grid">
                <div className="row">
                  <TopNav Tools={Tools}/>
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
