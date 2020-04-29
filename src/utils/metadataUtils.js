import NessLayer from '../nessMapping/nessLayer';

export const MDUtils = {
    getMDLayerById: (mdId) => {
        // TODO: access api to get metadata

        if (mdId !== 'debug') {
            return null;
        }

        // this is a debug layer...
        // TODO: remove this
        return { 
            metadataId: mdId, 
            alias: 'MockLayer',
            config: {
                LayerType: 'OL_ImageLayer',
            }
        };
    }
}