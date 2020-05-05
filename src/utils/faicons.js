import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faLayerGroup,
  faMap,
  faDrawPolygon,
  faRuler,
  faMapPin,
  faVial,
  faTrashAlt,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";

export const InitIcons = () => {
  library.add(fab, faLayerGroup, faMap, faDrawPolygon, faRuler, faMapPin, faVial, faTrashAlt, faEye, faEyeSlash);
};
