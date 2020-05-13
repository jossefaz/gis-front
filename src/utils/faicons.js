import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faLayerGroup,
  faMapMarkerAlt,
  faMap,
  faDrawPolygon,
  faRuler,
  faMapPin,
  faVial,
  faTrashAlt,
  faEye,
  faEyeSlash,
  faCrosshairs,
  faTrafficLight
} from "@fortawesome/free-solid-svg-icons";

export const InitIcons = () => {
  library.add(fab, faLayerGroup, faMap, faDrawPolygon, faMapMarkerAlt, faRuler, faMapPin, faVial, faTrashAlt, faEye, faCrosshairs, faEyeSlash, faTrafficLight);
};
