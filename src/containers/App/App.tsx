import React, { useEffect } from 'react';
import MapTabs from '../../components/MapTabs/MapTabs';
import Map from '../Map/Map';
import TopNav from '../TopNav';
import SideNav from '../SideNav';
import config from '../../configuration';
import { InitIcons } from '../../utils/faicons';
import WidgetFixContainer from '../Widget/StickyToolContainer';
import WidgetMapContainer from '../Widget/DynamicToolContainer';
import { ToastProvider } from 'react-toast-notifications';
import '../../style.css';
import Props from './props';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { selectFocusedMapTools } from '../../state/reducers';
import { useTypedSelector } from '../../hooks/useTypedSelectors';
import LoginForm from '../../components/Login';
import { useActions } from '../../hooks/useActions';
import { TokenData } from '../../core/types';

interface StoredJWT {
  value: TokenData;
  expiry: number;
}

const App: React.FC<Props> = (props) => {
  const { jwt } = useTypedSelector((state) => state.auth);
  window.addEventListener('unload', function (event) {
    localStorage.setItem(
      'jwt',
      JSON.stringify({
        value: jwt,
        expiry: new Date().getTime() + 5000,
      })
    );
  });
  const { InitLayers, InitMap, InitRasters, InitTools, mapState } = props;
  const Tools = useTypedSelector(selectFocusedMapTools);
  const { setToken } = useActions();

  const bootstrap = () => {
    InitRasters();
    InitMap();
    InitTools(config().Widgets);
    InitLayers();
  };

  const setTokenIfExists = () => {
    let stored_jwt = localStorage.getItem('jwt');
    console.log(`stored_jwt`, stored_jwt);
    if (stored_jwt) {
      const sjwt = JSON.parse(stored_jwt) as StoredJWT;
      const now = new Date();
      sjwt.expiry > now.getTime() && setToken(sjwt.value);
    }
  };

  useEffect(() => {
    bootstrap();
    InitIcons();
    setTokenIfExists();
  }, []);

  return jwt.access_token && mapState ? (
    <React.Fragment>
      <ToastProvider placement="bottom-left">
        <DndProvider backend={HTML5Backend}>
          <SideNav>
            <div className="ui grid">
              <div className="row">
                <TopNav Tools={Tools} />
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
  ) : (
    <LoginForm />
  );
};

export default App;
