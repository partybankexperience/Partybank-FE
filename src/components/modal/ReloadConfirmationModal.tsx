
import React from 'react';
import { Modal } from './Modal';
import DefaultButton from '../buttons/DefaultButton';

interface ReloadConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ReloadConfirmationModal: React.FC<ReloadConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure you want to reload?",
  message = "You have unsaved changes. Reloading the page will lose any progress you've made.",
  confirmText = "Reload Anyway",
  cancelText = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-black">
          {title}
        </h2>
        <p className="text-gray-600">
          {message}
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <DefaultButton
            variant="secondary"
            onClick={onCancel}
            className="border !bg-white"
          >
            {cancelText}
          </DefaultButton>
          <DefaultButton
            variant="primary"
            onClick={onConfirm}
          >
            {confirmText}
          </DefaultButton>
        </div>
      </div>
    </Modal>
  );
};
