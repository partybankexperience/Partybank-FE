
import React, { useEffect, useRef } from 'react';
import { RxCrossCircled } from "react-icons/rx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const disabledElements = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const allFocusableOutsideModal = document.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    disabledElements.current = Array.from(allFocusableOutsideModal).filter(
      (el) => !modalRef.current?.contains(el)
    );

    disabledElements.current.forEach((el) => el.setAttribute('tabindex', '-1'));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedElement.current?.focus();

      // Restore original tabindex
      disabledElements.current.forEach((el) => el.removeAttribute('tabindex'));
    };
  }, [isOpen, onClose]);
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-[calc(100vw-40px)] md:w-full"
      >
        <button className="flex justify-end
        "onClick={onClose}>
        <RxCrossCircled className='text-primary hover:text-deepRed cursor-pointer text-[20px] ' 
          aria-description='Close modal' role='button' tabIndex={0}/>

        </button>
        {children}
      </div>
    </div>
  );
};
