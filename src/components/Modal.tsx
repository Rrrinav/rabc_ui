import React, { ReactNode, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // If modal is not open, return null
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      onClick={onClose}
    >
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-sec-bg-1 opacity-50"
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div
        className={`
          relative w-full ${sizeConfig[size]} 
          mx-auto my-6 
          transform transition-all duration-300 ease-in-out
          scale-100 opacity-100
          bg-primary-bg-1 rounded-lg shadow-xl
        `}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-solid border-gray-200 rounded-t">
          <h3 className="text-xl font-semibold text-primary-fg-2">{title}</h3>
          <button
            className="
              p-1 ml-auto bg-transparent border-0 
              text-primary-fg-2 float-right text-3xl 
              leading-none font-semibold outline-none 
              focus:outline-none hover:text-gray-100
              transition-colors duration-200
            "
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative p-6 flex-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
