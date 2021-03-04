import NessLayer from "../core/nessLayer";

export const LYRUtils = {
  getMDLayerByObject: (lyrObj) => {
    // TODO: process the lyrObj to produce a MDLayer

    if (lyrObj !== "debug") {
      return null;
    }

    // this is a debug layer...
    // TODO: remove this
    return {
      metadataId: -1,
      alias: "MockLayer",
      config: {},
    };
  },
};
