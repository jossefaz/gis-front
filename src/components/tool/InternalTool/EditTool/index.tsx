import React, { FC, useState } from "react";
import EditProxyManager from "../../../../core/proxymanagers/edit";
import { InteractionUtil } from "../../../../utils/interactions";
import EditForm from "./EditForm";
import API from "../../../../core/api";
import { click, doubleClick } from "ol/events/condition";
import Confirm from "../../../UI/Modal/Confirm";
import IconButton from "../../../UI/Buttons/IconButton";
import VectorLayerRegistry from "../../../../core/proxymanagers/vectorlayer";
import { selectVisibleLayers } from "../../../../state/reducers";
import { InteractionSupportedTypes as TYPES } from "../../../../core/types/interaction";
import GeometryType from "ol/geom/GeometryType";
import { Feature } from "ol";
import useNotifications from "../../../../hooks/useNotifications";
import { useActions } from "../../../../hooks/useActions";
import { SelectedFeature } from "../../../../core/types/feature";
import { useTypedSelector } from "../../../../hooks/useTypedSelectors";
import { useEffect } from "react";
const { getFocusedMap } = API.map;

interface editGeomState {
  geomType: GeometryType | null;
  openForm: boolean;
  newFeature: Feature | null;
  editFeature: Feature | null;
  fields: null;
  openConfirm: boolean;
  openCancelConfirm: boolean;
  addingIcon: boolean;
  editIcon: boolean;
}

const initialState: editGeomState = {
  geomType: null,
  openForm: false,
  newFeature: null,
  editFeature: null,
  fields: null,
  openConfirm: false,
  openCancelConfirm: false,
  addingIcon: false,
  editIcon: false,
};

const UI = {
  eraseFeature: {
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  },
  cancelFeature: {
    content: "? האם באמת לבטל את כלל השינוים ",
    confirmBtn: "כן",
    cancelBtn: "לא",
  },
};

const EditTool: FC<{ uuid: string }> = ({ uuid: layeruuid }) => {
  debugger;
  const WIDGET_NAME = "EditTool";

  const interactions = new InteractionUtil(WIDGET_NAME);
  let editProxy = EditProxyManager.getInstance([layeruuid]).registry[layeruuid];
  const vlregistry = VectorLayerRegistry.getInstance();
  const [state, setState] = useState<editGeomState>(initialState);
  const { errorNotification, successNotification } = useNotifications();
  const {
    setSelectedFeatures,
    setCurrentFeature,
    toggleToolByName,
  } = useActions();
  const visibleLayer = useTypedSelector(selectVisibleLayers);

  const onDrawEnd = () => {
    if (interactions.currentDraw) {
      interactions.currentDraw.on("drawend", async ({ feature }) => {
        if (feature) {
          setState({
            ...state,
            newFeature: feature,
            editFeature: null,
            openForm: true,
          });
          const geometry = feature.getGeometry();
          if (geometry) {
            getFocusedMap()
              .getView()
              .fit(geometry.getExtent(), { padding: [850, 850, 850, 850] });
          }
          interactions.unDraw();
        }
      });
    }
  };

  const onAddFeature = () => {
    if (state.geomType && state.geomType) {
      interactions.unSelect();
      interactions.newDraw({ type: state.geomType });
      setState({
        ...state,
        openForm: false,
        newFeature: null,
        editFeature: null,
        addingIcon: true,
        editIcon: false,
      });
      onDrawEnd();
    }
  };

  const onDeleteFeature = () => setState({ ...state, openConfirm: true });

  const onDeleteConfirm = async () => {
    const deleted = await editProxy.remove();
    if (deleted) {
      successNotification("Successfully removed feature !");
      setState({
        ...state,
        openConfirm: false,
        openForm: false,
        newFeature: null,
        editFeature: null,
        addingIcon: false,
        editIcon: true,
      });
      interactions.unModify();
      interactions.unDraw();
    } else {
      errorNotification("Failed to remove feature !");
      setState({
        ...state,
        openConfirm: false,
      });
    }
  };

  const onSelectEnd = () => {
    if (interactions.currentSelect) {
      interactions.currentSelect.on("select", (e) => {
        if (e.selected.length > 0) {
          const selectedF = e.selected[0];
          setState({
            ...state,
            editFeature: selectedF,
            newFeature: null,
            openForm: true,
          });
          const vlproxy = vlregistry.getVectorLayer(layeruuid);
          const candidate = vlproxy.olFeatureToFeature(selectedF);
          const fid = selectedF.getId();
          if (vlproxy.metadata && fid) {
            setSelectedFeatures({
              [vlproxy.metadata.restId]: [candidate],
            } as SelectedFeature);
            setCurrentFeature(`${fid}`);
            toggleToolByName("Identify", true, false);
          } else if (state.editFeature) {
            interactions.currentSelect &&
              interactions.currentSelect.getFeatures().push(state.editFeature);
          }
        }
      });
    }
  };

  const getVectorLayer = () => vlregistry.getVectorLayer(layeruuid).vectorLayer;

  const onIdentifyFeature = () => {
    const vl = getVectorLayer();
    if (vl) {
      interactions.unDraw();
      interactions.newSelect(null, [vl], true, doubleClick);
      setState({
        ...state,
        openForm: false,
        newFeature: null,
        editFeature: null,
        addingIcon: false,
        editIcon: true,
      });
      const vs = interactions.getVectorSource(TYPES.DRAW);
      if (vs) {
        vs.clear();
      }
      onSelectEnd();
    }
  };

  const getMetadata = async () => {
    const metadata = await editProxy.getMetadata();
    try {
      const geomType = metadata.featureTypes[0].properties.find((t: any) =>
        t.name.includes("geom")
      ).localType;
      setState({
        ...state,
        geomType,
        fields: metadata.featureTypes[0].properties,
      });
    } catch (error) {
      errorNotification("Failed to get layers metadata from Server !");
    }
  };

  const onEditCancel = () => setState({ ...state, openCancelConfirm: true });

  const onEditCancelConfirm = () => {
    setState({
      ...state,
      openConfirm: false,
      openCancelConfirm: false,
      openForm: false,
      newFeature: null,
      editFeature: null,
      addingIcon: false,
      editIcon: false,
    });
    const vs = interactions.getVectorSource(TYPES.DRAW);
    vs && vs.clear();
    vlregistry.getVectorLayer(layeruuid).hideAllFeatures();
  };

  const onSubmit = () => {
    interactions.clearVectorSource(TYPES.DRAW);
    interactions.unsetAll();
    setState({ ...state, newFeature: null, openForm: false });
  };

  useEffect(() => {
    debugger;
    if (visibleLayer.includes(layeruuid)) {
      vlregistry.initVectorLayers([layeruuid]);
      EditProxyManager.getInstance([layeruuid]) && getMetadata();
    }
    return () => {
      interactions.clearVectorSource(TYPES.DRAW);
      interactions.unsetAll();
      EditProxyManager.getInstance([]).removeItem(layeruuid);
    };
  }, []);

  return (
    <React.Fragment>
      {editProxy && state.fields && state.newFeature && (
        <EditForm
          fields={state.fields}
          feature={state.newFeature}
          onSubmit={onSubmit}
          editProxy={editProxy}
          values={state.editFeature ? state.editFeature.getProperties() : null}
          onCancel={onEditCancel}
          onDeleteFeature={onDeleteFeature}
          existingFeature={Boolean(state.editFeature)}
          openForm={state.openForm}
        />
      )}
      {layeruuid && visibleLayer.includes(layeruuid) && (
        <React.Fragment>
          <IconButton
            className={`ui icon button pointer ${
              state.addingIcon ? "secondary" : "primary"
            }`}
            onClick={onAddFeature}
            icon="plus-square"
            size="lg"
          />
          <IconButton
            className={`ui icon button pointer ${
              state.editIcon ? "secondary" : "primary"
            }`}
            onClick={onIdentifyFeature}
            icon="edit"
            size="lg"
          />
          <Confirm
            isOpen={state.openConfirm}
            confirmTxt={UI.eraseFeature.content}
            cancelBtnTxt={UI.eraseFeature.cancelBtn}
            confirmBtnTxt={UI.eraseFeature.confirmBtn}
            onCancel={() => setState({ ...state, openConfirm: false })}
            onConfirm={onDeleteConfirm}
          />
          <Confirm
            isOpen={state.openCancelConfirm}
            confirmTxt={UI.cancelFeature.content}
            cancelBtnTxt={UI.cancelFeature.cancelBtn}
            confirmBtnTxt={UI.cancelFeature.confirmBtn}
            onCancel={() => setState({ ...state, openCancelConfirm: false })}
            onConfirm={onEditCancelConfirm}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default EditTool;
