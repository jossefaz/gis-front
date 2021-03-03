import API from "../../../core/api";
export default {
  zoomTo: {
    fn: (row) => API.features.zoomTo(row.original.geometry),
    icon: "zoomTo",
  },
  Edit: {
    fn: (row) => console.log("will be edited", row),
    icon: "Edit",
  },
};
