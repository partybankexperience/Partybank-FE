import React, { useEffect, useRef } from 'react';

interface SidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const SidebarModal: React.FC<SidebarModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
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
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sidebar-modal-title"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white h-full w-[80%] max-w-xs p-6 overflow-y-auto relative"
      >
        {title && (
          <h2 id="sidebar-modal-title" className="text-lg font-bold mb-4">
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="absolute top-4 right-4 text-primary hover:text-deepRed text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
