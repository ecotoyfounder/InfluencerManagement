import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
  isVisible: boolean;
  onConfirm?: () => void;
  confirmButtonLabel?: string;
  confirmButtonStyle?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  onClose,
  isVisible,
  onConfirm,
  confirmButtonLabel,
  confirmButtonStyle,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <Button onClick={onClose}>Close</Button>
          {onConfirm && confirmButtonLabel && (
            <Button className={confirmButtonStyle} onClick={onConfirm}>
              {confirmButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
