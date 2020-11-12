import { zoomTo } from "../../../nessMapping/api";
export default {
  zoomTo: {
    fn: (row) => zoomTo(row.original.geometry),
    icon: "zoomTo",
  },
  Edit: {
    fn: (row) => console.log("will be edited", row),
    icon: "Edit",
  },
};
