import { MapBrowserEvent } from "ol";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { SelectedFeature } from "../../../core/types";
import { lazy } from "react";

import _ from "lodash";
import { Suspense } from "react";

const ContextMenuContainer: React.FC<{
  features: SelectedFeature;
  clientXY: any[];
}> = ({ clientXY, features }) => {
  const [render, setRender] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const setMenuPosition = () => {
    if (menuRef.current && clientXY) {
      const clickX = clientXY[0];
      const clickY = clientXY[1];
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = menuRef.current.offsetWidth;
      const rootH = menuRef.current.offsetHeight;

      const right = screenW - clickX > rootW;
      const left = !right;
      const top = screenH - clickY > rootH;
      const bottom = !top;

      if (right) {
        menuRef.current.style.left = `${clickX + 5}px`;
      }

      if (left) {
        menuRef.current.style.left = `${clickX - rootW - 5}px`;
      }

      if (top) {
        menuRef.current.style.top = `${clickY + 5}px`;
      }

      if (bottom) {
        menuRef.current.style.top = `${clickY - rootH - 5}px`;
      }
      menuRef.current.style.zIndex = "9";
    }
  };

  useEffect(() => {
    setMenuPosition();
    setRender(!render);
  }, [clientXY[0], clientXY[1]]);
  const ContextMenu = lazy(() => import("../index"));
  return (
    <div ref={menuRef} className="contextMenu">
      {
        <React.Fragment>
          <div className="contextMenu--option">
            {features[Object.keys(features)[0]][0].id}
          </div>
          <Suspense fallback={<div>Loading ...</div>}>
            <ContextMenu
              candidateFeature={features[Object.keys(features)[0]][0]}
            />
          </Suspense>
        </React.Fragment>
      }
    </div>
  );
};

export default React.memo(ContextMenuContainer, (props, nextProps) => {
  const currentFeatures = props.features;
  const nextFeatures = nextProps.features;
  return _.isEqual(currentFeatures, nextFeatures);
});
