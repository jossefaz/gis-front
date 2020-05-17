export const MDUtils = {
    getMDLayerFromJson: (jsonLayer) => {

        if (jsonLayer) {
            return {
                semanticId: jsonLayer.semanticid,
                alias: jsonLayer.title,
                displayExpression: jsonLayer.displayexpression,
                config: {
                    LayerType: "OL_ImageLayer",
                    SourceOptions: {
                        ratio: 1,
                        params: {
                            "LAYERS": jsonLayer.restid
                        },
                        url: jsonLayer.restaddress
                    }
                }
            }
        } else
            return null;
    },

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
        }
    }
}