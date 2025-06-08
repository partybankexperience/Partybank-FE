
import { useReloadConfirmation } from './useReloadConfirmation';

interface UseFormReloadProtectionProps {
  hasUnsavedChanges: boolean;
  formName?: string;
}

export const useFormReloadProtection = ({ 
  hasUnsavedChanges, 
  formName = 'form' 
}: UseFormReloadProtectionProps) => {
  const { showReloadConfirmation, handleReloadConfirm, handleReloadCancel } = useReloadConfirmation({
    shouldWarn: hasUnsavedChanges,
    customMessage: `You have unsaved changes in your ${formName}. Reloading will lose your progress.`
  });

  return {
    showReloadConfirmation,
    handleReloadConfirm,
    handleReloadCancel,
  };
};
