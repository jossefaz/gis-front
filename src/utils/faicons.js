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
  faTrafficLight,
  faPencilRuler,
  faEdit,
  faCircle,
  faGripLines,
  faFont,
  faItalic,
  faBold,
  faHeading,
  faAngleDoubleLeft,
  faMapMarkedAlt,
  faCameraRetro,
  faPhotoVideo
} from "@fortawesome/free-solid-svg-icons";

export const InitIcons = () => {
  library.add(
    faPhotoVideo,
    fab,
    faItalic,
    faMapMarkedAlt,
    faCameraRetro,
    faAngleDoubleLeft,
    faHeading,
    faBold,
    faFont,
    faGripLines,
    faEdit,
    faCircle,
    faPencilRuler,
    faLayerGroup,
    faMap,
    faDrawPolygon,
    faMapMarkerAlt,
    faRuler,
    faMapPin,
    faVial,
    faTrashAlt,
    faEye,
    faCrosshairs,
    faEyeSlash,
    faTrafficLight
  );
};
