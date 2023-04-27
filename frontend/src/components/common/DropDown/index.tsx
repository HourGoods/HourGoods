/* eslint-disable */
import React, { useRef, useState } from "react";
import useModalRef from "@hooks/useModalRef";
import { useNavigate } from "react-router";

export type Option = {
  label: string;
  value: string;
};

type MenuProps = {
  menus: Option[];
};

export default function index({ menus }: MenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function handleOptionClick(menu: Option) {
    setIsOpen(false);
    navigate(`${menu.value}`);
  }

  useModalRef(dropdownRef, () => setIsOpen(false));

  return (
    <div className="dropdown-container">
      {isOpen && (
        <div className="dropdown-menu" ref={dropdownRef}>
          {menus.map((menu: Option) => (
            <div
              key={menu.value}
              className="dropdown-option"
              onClick={() => handleOptionClick(menu)}
            >
              {menu.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
