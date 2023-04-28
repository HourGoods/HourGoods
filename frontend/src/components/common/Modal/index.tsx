// Modal.tsx
import React, { useRef } from "react";
import useModalRef from "@hooks/useModalRef";
import "./index.scss";
import { XCircleIcon } from "@heroicons/react/24/solid";
import pinkCloud from "@assets/pinkCloud.svg";
import purpleCloud from "@assets/purpleCloud.svg";

interface IModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function Modal({ setModalOpen, children }: IModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalRef(modalRef, () => setModalOpen(false));

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="common-modal-container">
      <div className="common-modal-overlay">
        <div className="common-modal-box" ref={modalRef}>
          <img src={pinkCloud} alt="" className="upper-cloud-img" />
          <button
            type="button"
            className="common-modal-close-button"
            onClick={closeModal}
          >
            <XCircleIcon />
          </button>
          {children}
          <img src={purpleCloud} alt="" className="bottom-cloud-img" />
        </div>
      </div>
    </div>
  );
}
