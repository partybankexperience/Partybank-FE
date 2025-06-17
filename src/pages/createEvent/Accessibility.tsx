
import { useRef, useEffect } from "react";
import RadioButton from "../../components/inputs/RadioButton";
import SlideToggle from "../../components/inputs/SlideToggle";
import DefaultInput from "../../components/inputs/DefaultInput";
import { useEventStore } from "../../stores/useEventStore";

const Accessibility = () => {
  const { form, setFormValue, errors } = useEventStore();
  const accessibilityForm = form["Accessibility"] || {};
  const accessibilityErrors = errors["Accessibility"] || {};

  const selected = accessibilityForm.eventVisibility || "";
  const featuresEvent = accessibilityForm.wheelchairAccess || "";
  const parking = accessibilityForm.parkingAvailable || "";
  const toggle = accessibilityForm.transferCharges || false;
  const minAge = accessibilityForm.minAge || "";

  const eventVisibilityRef = useRef<any>(null);
  const wheelchairAccessRef = useRef<any>(null);
  const parkingAvailableRef = useRef<any>(null);
  const minAgeRef = useRef<any>(null);

  const eventVisibility = [
    { name: "Public Event", value: "public", extraText: "Visible to all users" },
    { name: "Private Event", value: "private", extraText: "Access via direct link or invite" },
  ];
  const features = ["Yes", "No"];
  const list = [
    "If enabled, attendees cover platform/service fees instead of the organizer.",
    "This will be reflected in the ticket price during checkout.",
  ];

  const handleInputChange = (key: string, value: any) => {
    setFormValue("Accessibility", key, value);
  };

  const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(accessibilityErrors).length > 0) {
      setTimeout(() => {
        if (accessibilityErrors.eventVisibility && eventVisibilityRef.current) {
          eventVisibilityRef.current.focus();
        } else if (accessibilityErrors.wheelchairAccess && wheelchairAccessRef.current) {
          wheelchairAccessRef.current.focus();
        } else if (accessibilityErrors.parkingAvailable && parkingAvailableRef.current) {
          parkingAvailableRef.current.focus();
        } else if (accessibilityErrors.minAge && minAgeRef.current) {
          minAgeRef.current.focus();
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
    <div>
      <div className="grid gap-2">
        <h2 className="text-black text-[1rem] font-bold">
          Event Visibility & Access
        </h2>
        <div
          role="radiogroup"
          aria-label="Select an option"
          className="grid md:grid-cols-2 gap-4 md:gap-[2.5rem]"
          ref={eventVisibilityRef}
        >
          {eventVisibility.map((lab, idx) => {
            const val = `option${idx + 1}`;
            return (
              <RadioButton
                key={val}
                label={lab.name}
                value={lab.value}
                name="event-visibility"
                checked={selected === lab.value}
                onChange={(val: string) =>
                  handleInputChange("eventVisibility", val)
                }
                extraText={lab.extraText}
              />
            );
          })}
        </div>
        {accessibilityErrors.eventVisibility && (
          <p className="text-[13px] text-red-500 mt-1">
            {accessibilityErrors.eventVisibility}
          </p>
        )}
      </div>

      <h2 className="text-black text-[1rem] mt-[2.5rem] font-bold">
        Accessibility Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mt-[10px]">
        <div className="grid gap-2">
          <p className="text-black text-[1rem]">Wheelchair Accessibility</p>
          <div
            role="radiogroup"
            aria-label="Select an option"
            className="grid md:flex gap-4 md:gap-[2.5rem]"
            ref={wheelchairAccessRef}
          >
            {features.map((lab, idx) => {
              const val = `wheelchair-${idx + 1}`;
              return (
                <RadioButton
                  key={val}
                  label={lab}
                  value={lab}
                  name="wheelchair"
                  checked={featuresEvent === lab}
                  onChange={(val: string) =>
                    handleInputChange("wheelchairAccess", val)
                  }
                />
              );
            })}
          </div>
          {accessibilityErrors.wheelchairAccess && (
            <p className="text-[13px] text-red-500 mt-1">
              {accessibilityErrors.wheelchairAccess}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <p className="text-black text-[1rem]">Parking Availability</p>
          <div
            role="radiogroup"
            aria-label="Select an option"
            className="grid md:flex gap-4 md:gap-[2.5rem]"
            ref={parkingAvailableRef}
          >
            {features.map((lab, idx) => {
              const val = `parking-${idx + 1}`;
              return (
                <RadioButton
                  key={val}
                  label={lab}
                  value={lab}
                  name="parking"
                  checked={parking === lab}
                  onChange={(val: string) =>
                    handleInputChange("parkingAvailable", val)
                  }
                />
              );
            })}
          </div>
          {accessibilityErrors.parkingAvailable && (
            <p className="text-[13px] text-red-500 mt-1">
              {accessibilityErrors.parkingAvailable}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-[20px] mt-[2.5rem]">
        <DefaultInput
          id="minAge"
          label="Minimum Age Requirement"
          type="number"
          value={minAge}
          setValue={(value: string) => handleInputChange("minAge", value)}
          placeholder="e.g., 18 (leave empty for no restriction)"
          classname="!w-full md:!w-1/2"
          helperText={accessibilityErrors.minAge || ""}
          style={accessibilityErrors.minAge ? "border-red-500" : ""}
          inputRef={minAgeRef}
        />
      </div>

      <div className="grid gap-[15px] mt-[2.5rem]">
        <div className="flex items-center justify-between w-full">
          <p className="font-bold text-[1rem]">
            Transfer Event Charges to Customers
          </p>
          <SlideToggle
            toggle={(val: boolean) =>
              handleInputChange("transferCharges", val)
            }
            isChecked={toggle}
          />
        </div>
        {accessibilityErrors.transferCharges && (
          <p className="text-[13px] text-red-500 mt-1">
            {accessibilityErrors.transferCharges}
          </p>
        )}

        <ul className="grid gap-[10px] list-disc pl-5">
          {list.map((lab, idx) => (
            <li key={idx} className="text-[#918F90] text-[.8rem]">
              {lab}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Accessibility;
