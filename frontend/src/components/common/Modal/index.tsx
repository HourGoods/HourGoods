import React, { useRef } from "react";
import useModalRef from "@hooks/useModalRef";
import "./index.scss";
import { XCircleIcon } from "@heroicons/react/24/solid";
import blueCloud from "@assets/blueCloud.svg";
import yellowCloud from "@assets/yellowCloud.svg";

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
      <img src={blueCloud} alt="" />
      <button type="button" className="close" onClick={closeModal}>
        <XCircleIcon />
      </button>
      <p>모달창입니다.</p>
      <img src={yellowCloud} alt="" />
    </div>
  );
}
