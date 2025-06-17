import { useEffect, useRef, useState } from "react";
import DefaultInput from "../../components/inputs/DefaultInput";
import { useEventStore } from "../../stores/useEventStore";

const Accessibility = () => {
  const { form, setFormValue, errors } = useEventStore();
  const accessibilityForm = form["Accessibility"] || {};
  const accessibilityErrors = errors["Accessibility"] || {};
  const [localErrors, setLocalErrors] = useState<Record<string, boolean>>({});

  // Create refs for all input fields
  const wheelchairAccessRef = useRef<any>(null);
  const signLanguageRef = useRef<any>(null);
  const audioDescriptionRef = useRef<any>(null);
  const largeTextRef = useRef<any>(null);
  const additionalNotesRef = useRef<any>(null);

  const handleInputChange = (key: string, value: any) => {
    setFormValue("Accessibility", key, value);
  };

  const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(accessibilityErrors).length > 0) {
      setTimeout(() => {
        if (accessibilityErrors.wheelchairAccess && wheelchairAccessRef.current) {
          wheelchairAccessRef.current.focus();
        } else if (accessibilityErrors.signLanguage && signLanguageRef.current) {
          signLanguageRef.current.focus();
        } else if (accessibilityErrors.audioDescription && audioDescriptionRef.current) {
          audioDescriptionRef.current.focus();
        } else if (accessibilityErrors.largeText && largeTextRef.current) {
          largeTextRef.current.focus();
        } else if (accessibilityErrors.additionalNotes && additionalNotesRef.current) {
          additionalNotesRef.current.focus();
        }
      }, 100);
    }

    return Object.keys(accessibilityErrors).length === 0;
  };

  // Export validation function for external use
  useEffect(() => {
    (window as any).validateAccessibility = validateForm;
    return () => {
      delete (window as any).validateAccessibility;
    };
  }, [accessibilityForm]);

  return (
    <div className="grid gap-[20px]">
      <div className="grid gap-2">
        <h2 className="text-black text-[1.2rem] font-semibold">Accessibility Features</h2>
        <p className="text-gray-600 text-sm">
          Please specify any accessibility accommodations your event will provide.
        </p>
      </div>

      <DefaultInput
        id="wheelchairAccess"
        label="Wheelchair Accessibility"
        value={accessibilityForm.wheelchairAccess || ""}
        setValue={(value: string) => handleInputChange("wheelchairAccess", value)}
        placeholder="Select wheelchair accessibility"
        showDropdown
        dropdownOptions={["Fully Accessible", "Partially Accessible", "Not Accessible"]}
        required
        helperText={accessibilityErrors.wheelchairAccess || ""}
        style={accessibilityErrors.wheelchairAccess ? "border-red-500" : ""}
        classname="!w-full"
        inputRef={wheelchairAccessRef}
        setExternalError={(hasError) => setLocalErrors(prev => ({ ...prev, wheelchairAccess: hasError }))}
      />

      <DefaultInput
        id="signLanguage"
        label="Sign Language Interpretation"
        value={accessibilityForm.signLanguage || ""}
        setValue={(value: string) => handleInputChange("signLanguage", value)}
        placeholder="Select sign language support"
        showDropdown
        dropdownOptions={["Available", "Available Upon Request", "Not Available"]}
        helperText={accessibilityErrors.signLanguage || ""}
        style={accessibilityErrors.signLanguage ? "border-red-500" : ""}
        classname="!w-full"
        inputRef={signLanguageRef}
        setExternalError={(hasError) => setLocalErrors(prev => ({ ...prev, signLanguage: hasError }))}
      />

      <DefaultInput
        id="audioDescription"
        label="Audio Description Services"
        value={accessibilityForm.audioDescription || ""}
        setValue={(value: string) => handleInputChange("audioDescription", value)}
        placeholder="Select audio description availability"
        showDropdown
        dropdownOptions={["Available", "Available Upon Request", "Not Available"]}
        helperText={accessibilityErrors.audioDescription || ""}
        style={accessibilityErrors.audioDescription ? "border-red-500" : ""}
        classname="!w-full"
        inputRef={audioDescriptionRef}
        setExternalError={(hasError) => setLocalErrors(prev => ({ ...prev, audioDescription: hasError }))}
      />

      <DefaultInput
        id="largeText"
        label="Large Text Materials"
        value={accessibilityForm.largeText || ""}
        setValue={(value: string) => handleInputChange("largeText", value)}
        placeholder="Select large text availability"
        showDropdown
        dropdownOptions={["Available", "Available Upon Request", "Not Available"]}
        helperText={accessibilityErrors.largeText || ""}
        style={accessibilityErrors.largeText ? "border-red-500" : ""}
        classname="!w-full"
        inputRef={largeTextRef}
        setExternalError={(hasError) => setLocalErrors(prev => ({ ...prev, largeText: hasError }))}
      />

      <DefaultInput
        id="additionalNotes"
        label="Additional Accessibility Notes"
        value={accessibilityForm.additionalNotes || ""}
        setValue={(value: string) => handleInputChange("additionalNotes", value)}
        placeholder="Any additional accessibility information or accommodations"
        helperText={accessibilityErrors.additionalNotes || ""}
        style={accessibilityErrors.additionalNotes ? "border-red-500" : ""}
        classname="!w-full"
        inputRef={additionalNotesRef}
        setExternalError={(hasError) => setLocalErrors(prev => ({ ...prev, additionalNotes: hasError }))}
      />
    </div>
  );
};

export default Accessibility;