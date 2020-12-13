export default async (baseURL, LayerID, FeatureID, cb) => {
  if (LayerID == "dimigcompile") {
    cb([
      {
        ID: 1,
        Name: "Another Menu Action",
      },
    ]);
  }
};
