import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

interface Props {
  isOpen: boolean;
  cancelBtnTxt: string;
  confirmBtnTxt: string;
  confirmTxt: string;
  onConfirm: () => void;
  onCancel: () => void;
  afterOpen?: () => void;
  onClose?: () => void;
}

const ModalComp: React.FC<Props> = ({
  isOpen,
  cancelBtnTxt,
  confirmBtnTxt,
  confirmTxt,
  onConfirm,
  onCancel,
  afterOpen,
  onClose,
}) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpen ? afterOpen : undefined}
        onRequestClose={onClose ? onClose : undefined}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p>{confirmTxt}</p>
        <button onClick={onConfirm}>{confirmBtnTxt}</button>
        <button onClick={onCancel}>{cancelBtnTxt}</button>
      </Modal>
    </div>
  );
};

export default ModalComp;
