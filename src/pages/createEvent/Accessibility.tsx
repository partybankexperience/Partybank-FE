import RadioButton from "../../components/inputs/RadioButton";
import SlideToggle from "../../components/inputs/SlideToggle";
import { useEventStore } from "../../stores/useEventStore";

const Accessibility = () => {
  const { form, setFormValue } = useEventStore();
  const accessibilityForm = form["Accessibility"] || {};

  const selected = accessibilityForm.eventVisibility || "";
  const featuresEvent = accessibilityForm.wheelchairAccess || "";
  const parking = accessibilityForm.parkingAvailable || "";
  const toggle = accessibilityForm.transferCharges || false;

  const eventVisibility = [
    { name: "Public Event", extraText: "Visible to all users" },
    { name: "Private Event", extraText: "Access via direct link or invite" },
  ];
  const features = ["Yes", "No"];
  const list = [
    "If enabled, attendees cover platform/service fees instead of the organizer.",
    "This will be reflected in the ticket price during checkout.",
  ];

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
        >
          {eventVisibility.map((lab, idx) => {
            const val = `option${idx + 1}`;
            return (
              <RadioButton
                key={val}
                label={lab.name}
                value={lab.name}
                name="event-visibility"
                checked={selected === lab.name}
                onChange={(val: string) =>
                  setFormValue("Accessibility", "eventVisibility", val)
                }
                extraText={lab.extraText}
              />
            );
          })}
        </div>
      </div>

      <h2 className="text-black text-[1rem] mt-[2.5rem] font-bold">
        Accessibility Features
      </h2>
      <div className="grid grid-cols-2 gap-[20px] mt-[10px]">
        <div className="grid gap-2">
          <p className="text-black text-[1rem]">Wheelchair Accessibility</p>
          <div
            role="radiogroup"
            aria-label="Select an option"
            className="grid md:flex gap-4 md:gap-[2.5rem]"
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
                    setFormValue("Accessibility", "wheelchairAccess", val)
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <p className="text-black text-[1rem]">Parking Availability</p>
          <div
            role="radiogroup"
            aria-label="Select an option"
            className="grid md:flex gap-4 md:gap-[2.5rem]"
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
                    setFormValue("Accessibility", "parkingAvailable", val)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-[15px] mt-[2.5rem]">
        <div className="flex items-center justify-between w-full">
          <p className="font-bold text-[1rem]">
            Transfer Event Charges to Customers
          </p>
          <SlideToggle
            toggle={(val: boolean) =>
              setFormValue("Accessibility", "transferCharges", val)
            }
            defaultChecked={toggle}
          />
        </div>

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
