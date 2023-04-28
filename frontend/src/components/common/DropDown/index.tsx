import React, { useRef, useState } from "react";
import useModalRef from "@hooks/useModalRef";
import { useNavigate } from "react-router";
import "./index.scss";

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
          {menus.map((menu: Option, index: number) => (
            <React.Fragment key={menu.value}>
              <button
                className="dropdown-option"
                type="button"
                onClick={() => handleOptionClick(menu)}
              >
                {menu.label}
              </button>
              {index % 2 === 0 && index !== menus.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
