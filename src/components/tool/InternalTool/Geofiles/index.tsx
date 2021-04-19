import { FC, useState, useEffect } from "react";
import { retrieveAllFiles, GeofileItem } from "../../../../core/HTTP/geofiles";
import _ from "lodash";

const Geofiles: FC = () => {
  const [filesMetadata, setFilesMetadata] = useState<GeofileItem[]>([]);

  useEffect(() => {
    retrieveAllFiles().then((fetchedFiles) => {
      const metadataChanged = _.isEqual(filesMetadata, fetchedFiles);
      if (!metadataChanged && fetchedFiles) {
        console.log(`updated`, fetchedFiles);
        setFilesMetadata(fetchedFiles);
      }
    });
  });

  return <div></div>;
};

export default Geofiles;
