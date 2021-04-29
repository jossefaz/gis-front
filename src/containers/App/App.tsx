import React, { useEffect } from "react";
import MapTabs from "../../components/MapTabs/MapTabs";
import Map from "../../components/Map/Map";
import MapMenu from "../../components/MapMenu";
import TopNav from "../TopNav";
import config from "../../configuration";
import { InitIcons } from "../../utils/faicons";
import WidgetFixContainer from "../Widget/StickyToolContainer";
import WidgetMapContainer from "../Widget/DynamicToolContainer";
import { ToastProvider } from "react-toast-notifications";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LayerListMain from "../../components/layers/LayerListMain";
import SeachComp from "../../components/Search";
import { selectFocusedMapTools } from "../../state/reducers";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import API from "../../core/api";
import { useActions } from "../../hooks/useActions";
import { TokenData } from "../../core/types";
import LoginForm from "../../components/Login";

interface StoredJWT {
  value: TokenData;
  expiry: number;
}

const App: React.FC = () => {
  const { jwt } = useTypedSelector((state) => state.auth);
  window.addEventListener("unload", function (event) {
    localStorage.setItem(
      "jwt",
      JSON.stringify({
        value: jwt,
        expiry: new Date().getTime() + 5000,
      })
    );
  });
  const { InitLayers, InitMap, InitRasters, InitTools } = useActions();
  const mapState = useTypedSelector((state) => state.map);
  const Tools = useTypedSelector(selectFocusedMapTools);
  const { setToken } = useActions();

  const setTokenIfExists = () => {
    let stored_jwt = localStorage.getItem("jwt");
    if (stored_jwt) {
      const sjwt = JSON.parse(stored_jwt) as StoredJWT;
      const now = new Date();
      sjwt.expiry > now.getTime() && setToken(sjwt.value);
      localStorage.removeItem("jwt");
    }
  };

  const bootstrap = () => {
    setTokenIfExists();
    InitIcons();
    InitRasters();
    InitMap();
    InitTools(config().Widgets);
    InitLayers();
  };

  useEffect(bootstrap, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mapId = API.map.getFocusedMapProxy()
    ? API.map.getFocusedMapProxy().uuid.value
    : null;

  return jwt.token && mapState ? (
    <React.Fragment>
      <ToastProvider placement="bottom-left">
        <DndProvider backend={HTML5Backend}>
          <div className="app rtl">
            <div className="app__side">
              <div className="layers-container">
                <SeachComp />
                <LayerListMain />
              </div>

              <WidgetFixContainer />
              {mapId && <TopNav Tools={Tools} />}
              <div
                id="app-side-content-container"
                className="app-side-content-container"
              ></div>
            </div>
            <div className="app__main">
              {mapId ? (
                <React.Fragment>
                  <MapTabs />
                  <Map />
                  <MapMenu />
                </React.Fragment>
              ) : null}
            </div>
          </div>
          <div
            id="append-element-sideNav"
            className="append-element-sideNav"
          ></div>
          <div
            id="append-element-container"
            className="append-element-container"
          ></div>
          <WidgetMapContainer />
        </DndProvider>
      </ToastProvider>
    </React.Fragment>
  ) : (
    <LoginForm />
  );
};

export default App;
