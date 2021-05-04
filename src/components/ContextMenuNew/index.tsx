import { useEffect, useRef, useState } from "react";

const ContextMenu: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const _handleClick = (event: any) => {
    setVisible(false);
  };

  const _handleScroll = () => {
    if (visible) setVisible(false);
  };

  const _handleContextMenu = (event: any) => {
    event.preventDefault();
    setVisible(true);

    if (menuRef.current) {
      const clickX = event.clientX;
      const clickY = event.clientY;
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
      menuRef.current.style.zIndex = "99";
    }
  };

  const addListeners = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.addEventListener("contextmenu", _handleContextMenu);
      mapDiv.addEventListener("click", _handleClick);
      mapDiv.addEventListener("scroll", _handleScroll);
    }
  };

  const removeListeners = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.removeEventListener("contextmenu", _handleContextMenu);
      mapDiv.removeEventListener("click", _handleClick);
      mapDiv.removeEventListener("scroll", _handleScroll);
    }
  };

  useEffect(() => {
    addListeners();
    return () => {
      removeListeners();
    };
  }, []);

  return visible ? (
    <div ref={menuRef} className="contextMenu">
      <div
        className="contextMenu--option"
        onClick={() => console.log("clicked")}
      >
        Share this
      </div>
      <div className="contextMenu--option">New window</div>
      <div className="contextMenu--option">Visit official site</div>
      <div className="contextMenu--option contextMenu--option__disabled">
        View full version
      </div>
      <div className="contextMenu--option">Settings</div>
      <div className="contextMenu--separator" />
      <div className="contextMenu--option">About this app</div>
    </div>
  ) : null;
};

export default ContextMenu;
