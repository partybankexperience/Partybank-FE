import { MdOutlineCalendarMonth } from "react-icons/md";
import DefaultButton from "../buttons/DefaultButton";
import DefaultInput from "../inputs/DefaultInput";
import { FaRegClock } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import RadioButton from "../inputs/RadioButton";
import { useEventStore } from "../../stores/useEventStore";
import { NumericFormat } from 'react-number-format';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CreateTicketComponent = () => {
  const location = useLocation();
  const showButtons = !location.pathname.includes("dashboard/create-event"); // example check

  const { form, setFormValue } = useEventStore();
  const currentStage = "Tickets Create";

  const label = [
    {
      name: "Single Ticket",
      extraText: "This will only allow a single entry per person to the event",
    },
    {
      name: "Group Ticket",
      extraText: "This will allow multiple entries to the event",
    },
  ];
  const ticketType = ["Free", "Paid"];

  const handleChange = (key: string, value: any) => {
    setFormValue(currentStage, key, value);
  };

  const getValue = (key: string) => {
    return form[currentStage]?.[key] || "";
  };

  const updatePerk = (index: number, value: any) => {
    const perks = getValue("perks") || [""];
    const updatedPerks = [...perks];
    updatedPerks[index] = value;
    handleChange("perks", updatedPerks);
  };

  const addPerk = () => {
    const perks = getValue("perks") || [""];
    handleChange("perks", [...perks, ""]);
  };

  const deletePerk = (index: number) => {
    const perks = getValue("perks") || [""];
    if (perks.length > 1) {
      const updatedPerks = perks.filter((_, i) => i !== index);
      handleChange("perks", updatedPerks);
    }
  };

  return (
    <div className="grid gap-[2.5rem] mt-[20px]">
      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Category</h2>
        <div
          role="radiogroup"
          aria-label="Select an option"
          className="grid md:flex gap-4"
        >
          {label.map((lab, idx) => {
            const val = `option${idx + 1}`;
            return (
              <RadioButton
                key={val}
                label={lab.name}
                value={val}
                name="ticket-category"
                checked={getValue("ticketCategory") === val}
                onChange={() => handleChange("ticketCategory", val)}
                extraText={lab.extraText}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Type</h2>
        <div className="grid md:flex gap-4 md:gap-[2.5rem]">
          {ticketType.map((type) => (
            <RadioButton
              key={type}
              label={type}
              value={type}
              name="ticket-type"
              checked={getValue("ticketType") === type}
              onChange={() => handleChange("ticketType", type)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Availability</h2>
        <div className="grid md:flex gap-4 md:gap-[2.5rem]">
          <RadioButton
            label="Limited"
            value="limited"
            name="ticket-availability"
            checked={getValue("ticketAvailability") === "limited"}
            onChange={() => handleChange("ticketAvailability", "limited")}
          />
          <RadioButton
            label="Unlimited"
            value="unlimited"
            name="ticket-availability"
            checked={getValue("ticketAvailability") === "unlimited"}
            onChange={() => handleChange("ticketAvailability", "unlimited")}
          />
        </div>
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Details</h2>
        <div className="grid gap-[15px] md:grid-cols-2">
          <DefaultInput
            id="ticketName"
            label="Ticket Name"
            value={getValue("ticketName")}
            setValue={(v:any) => handleChange("ticketName", v)}
            placeholder="Enter ticket name"
            classname="!w-full"
          />
          <DefaultInput
            id="purchaseLimit"
            label="Purchase Limit"
            value={getValue("purchaseLimit")}
            setValue={(v:any) => handleChange("purchaseLimit", v)}
            placeholder="1"
            classname="!w-full"
            type="number"
          />
          {getValue("ticketAvailability") === "limited" && (
            <DefaultInput
              id="stockAvailability"
              label="Stock Availability"
              value={getValue("stockAvailability")}
              setValue={(v:any) => handleChange("stockAvailability", v)}
              placeholder="Enter stock quantity"
              classname="!w-full"
              type="number"
            />
          )}
          {getValue("ticketType") === "Paid" && (
            <div className="grid gap-1 w-full relative">
              <label className="text-[#231F20] text-[16px] font-semibold font-[RedHat]">
                Price
              </label>
              <NumericFormat
                value={getValue("price")}
                onValueChange={(values) => {
                  handleChange("price", values.floatValue || 0);
                }}
                thousandSeparator=","
                prefix="₦"
                placeholder="₦0.00"
                className="text-[14px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[14px] font-[RedHat] rounded-[4px] py-[10px] px-[16px] !w-full bg-white border-neutral hover:border-lightPurple focus:border-lightPurple hover:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] focus:shadow-[0_0_0_2px_rgba(77,64,85,0.1)]"
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
              />
            </div>
          )}
          <DefaultInput
            id="soldTarget"
            label="Sold Target"
            value={getValue("soldTarget")}
            setValue={(v:any) => handleChange("soldTarget", v)}
            placeholder="Enter sold target"
            classname="!w-full"
            type="number"
          />
          {getValue("ticketCategory") === "option2" && (
            <DefaultInput
              id="numberOfPeople"
              label="Number of people"
              value={getValue("numberOfPeople")}
              setValue={(v:any) => handleChange("numberOfPeople", v)}
              placeholder="Enter number of people"
              classname="!w-full"
              type="number"
            />
          )}
        </div>
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Sale Date & Time</h2>
        <div className="grid gap-[15px] md:grid-cols-2">
          <DefaultInput
            id="salesStart"
            label="Sales Start"
            value={getValue("salesStart")}
            setValue={(v:any) => handleChange("salesStart", v)}
            placeholder="12/04/2025"
            classname="!w-full"
            type="date"
          />
          <DefaultInput
            id="startTime"
            label="Start Time"
            value={getValue("startTime")}
            setValue={(v:any) => handleChange("startTime", v)}
            placeholder="08:00"
            classname="!w-full"
            type="time"
          />
          <DefaultInput
            id="salesEnd"
            label="Sales End"
            value={getValue("salesEnd")}
            setValue={(v:any) => handleChange("salesEnd", v)}
            placeholder="16/04/2025"
            classname="!w-full"
            type="date"
          />
          <DefaultInput
            id="endTime"
            label="End Time"
            value={getValue("endTime")}
            setValue={(v:any) => handleChange("endTime", v)}
            placeholder="18:00"
            classname="!w-full"
            type="time"
          />
        </div>
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">
          Ticket Perks <span className="text-[#A7A5A6] text-[.8rem] font-light">(Optional)</span>
        </h2>
        {(getValue("perks") || [""]).map((perk: string, index: number) => (
          <DefaultInput
            key={index}
            id={`perks-${index}`}
            label={index === 0 ? "What extra benefits come with tickets" : `Perk ${index + 1}`}
            value={perk}
            setValue={(v: any) => updatePerk(index, v)}
            placeholder="Enter perk here"
            classname="!w-full"
            rightContent={
              <div className="flex items-center gap-2">
                {(getValue("perks") || [""]).length > 1 && (
                  <button
                    type="button"
                    onClick={() => deletePerk(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete this perk"
                  >
                    <FaTrash />
                  </button>
                )}
                {index === (getValue("perks") || [""]).length - 1 && (
                  <button
                    type="button"
                    onClick={addPerk}
                    className="text-primary hover:text-purple transition-colors"
                    aria-label="Add another perk"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
            }
          />
        ))}
      </div>

      {showButtons && (
        <div className="md:mx-auto grid md:flex gap-4">
          <DefaultButton variant="secondary" className="!w-full md:w-fit border !bg-white">
            Cancel
          </DefaultButton>
          <DefaultButton className="!w-full md:w-fit border whitespace-nowrap">
            Save Ticket
          </DefaultButton>
        </div>
      )}
    </div>
  );
};

export default CreateTicketComponent;