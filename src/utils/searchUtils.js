import NessSearching from "../searches/searches";

export const InitSearching = (searchConfigs) => {
    searchConfigs.forEach(spConfig => {
        NessSearching.getInstance().addProvider(spConfig);
    });
}
