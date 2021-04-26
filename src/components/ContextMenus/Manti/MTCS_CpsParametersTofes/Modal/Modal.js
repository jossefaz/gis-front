import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const customStyle = {
  content: {
    top: "15%",
    left: "0%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50, -50%)",
  },
};

const AppModal = ({ isModalOpen, afterOpen, closeModal, children }) => {
  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={afterOpen}
        onRequestClose={closeModal}
        style={customStyle}
      >
        {children}
      </Modal>
    </div>
  );
};

export default AppModal;
