export const MDUtils = {
    getMDLayerById: (mdId) => {
        // TODO: access api to get metadata

        if (mdId !== 999999) {
            return null;
        }

        // this is a debug layer...
        // TODO: remove this
        return {
            metadataId: mdId,
            alias: 'MockLayer',
            config: {
                LayerType: 'OL_ImageLayer',
                SourceType: 'OL_ImageArcGISRest',
                SourceOptions: {
                    ratio: 1,
                    params: {},
                    url: 'https://gisviewer.jerusalem.muni.il/arcgis/rest/services/BaseLayers/MapServer'
                }
            }
        };
    }
}