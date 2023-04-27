import React, { useRef } from "react";
import useModalRef from "@hooks/useModalRef";
import "./index.scss";

interface IModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function index({ setModalOpen }: IModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalRef(modalRef, () => setModalOpen(false));

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="container" ref={modalRef}>
      <button type="button" className="close" onClick={closeModal}>
        X
      </button>
      <p>모달창입니다.</p>
    </div>
  );
}
