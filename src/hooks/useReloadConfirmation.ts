
import { useState, useEffect } from 'react';

interface UseReloadConfirmationProps {
  shouldWarn: boolean;
  customMessage?: string;
}

export const useReloadConfirmation = ({ 
  shouldWarn, 
  customMessage = 'You have unsaved changes. Are you sure you want to reload?' 
}: UseReloadConfirmationProps) => {
  const [showReloadConfirmation, setShowReloadConfirmation] = useState(false);

  useEffect(() => {
    if (!shouldWarn) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = customMessage;
      return customMessage;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept Ctrl+R, Cmd+R, and F5
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        setShowReloadConfirmation(true);
      } else if (e.key === 'F5') {
        e.preventDefault();
        setShowReloadConfirmation(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldWarn, customMessage]);

  const handleReloadConfirm = () => {
    setShowReloadConfirmation(false);
    window.location.reload();
  };

  const handleReloadCancel = () => {
    setShowReloadConfirmation(false);
  };

  return {
    showReloadConfirmation,
    handleReloadConfirm,
    handleReloadCancel,
  };
};
