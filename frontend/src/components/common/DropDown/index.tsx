import React, { useRef, useState } from "react";
import useModalRef from "@hooks/useModalRef";
import { useNavigate } from "react-router";
import "./index.scss";

export type Option = {
  label: string;
  value?: string;
  onClick?: () => void;
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
    if (menu.value) {
      navigate(`${menu.value}`);
    } else if (menu.onClick) {
      // onClick 속성이 있는 경우 실행
      menu.onClick();
    }
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
              {index !== menus.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
