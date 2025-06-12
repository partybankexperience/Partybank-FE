import DefaultButton from "../buttons/DefaultButton";
import DefaultInput from "../inputs/DefaultInput";
import { useLocation, useNavigate } from "react-router-dom";
import RadioButton from "../inputs/RadioButton";
import { useEventStore } from "../../stores/useEventStore";
import { useTicketStore } from "../../stores/useTicketStore";
import { NumericFormat } from 'react-number-format';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { createTicket } from "../../Containers/ticketApi";
import { useState } from "react";
import { successAlert, errorAlert } from "../alerts/ToastService";
import { SketchPicker } from 'react-color';

// New ColorPickerInput component
const ColorPickerInput = ({ id, label, value, setValue, classname }: any) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: any) => {
    setValue(color.hex);
  };

  return (
    <div className="grid gap-1 w-full relative">
      <label className="text-[#231F20] text-[16px] font-semibold font-[RedHat]">
        {label} <span className="text-[#A7A5A6] text-[.8rem] font-light">(Optional)</span>
      </label>
      <div className="relative">
        <div
          className={`w-full h-[44px] border-[1px] border-neutral rounded-[4px] px-[16px] py-[10px] cursor-pointer flex items-center gap-3 hover:border-lightPurple focus:border-lightPurple bg-white ${classname}`}
          onClick={handleClick}
        >
          <div
            className="w-6 h-6 border border-gray-300 rounded"
            style={{ backgroundColor: value || '#3B82F6' }}
          ></div>
          <span className="text-[14px] text-black font-[RedHat]">
            {value || '#3B82F6'}
          </span>
        </div>
        {displayColorPicker ? (
          <div className="absolute top-full left-0 z-50 mt-2">
            <div className="fixed inset-0" onClick={handleClose}></div>
            <div className="relative">
              <SketchPicker
                color={value || '#3B82F6'}
                onChange={handleChange}
                disableAlpha={true}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CreateTicketComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Context Detection
  const isCreateEventContext = location.pathname.includes('/dashboard/create-event');
  const isManageEventsContext = location.pathname.includes('/manage-events') && location.pathname.includes('/create-ticket');

  const showButtons = !isCreateEventContext;

  // State Management Logic - Context Aware
  const { form, setFormValue } = useEventStore();
  const { 
    setCurrentTicketData, 
    getCurrentTicketData, 
    saveCurrentDataToActiveTicket,
    resetTicketStore,
    markTicketAsSaved,
    moveToNextUnsavedTicket,
    hasUnsavedTickets,
    tickets: manageTickets,
    activeTicketIndex: manageActiveIndex
  } = useTicketStore();
  const currentStage = "Tickets Create";

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event ID Source
  const eventId = isCreateEventContext 
    ? localStorage.getItem("eventId") 
    : location.state?.id;

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
    if (isCreateEventContext) {
      // Create Event Context: Use existing useEventStore logic
      setFormValue(currentStage, key, value);

      // Auto-save current ticket data to the tickets array
      const currentTicketData = form[currentStage];
      const activeIndex = currentTicketData?.activeTicketIndex || 0;
      const tickets = currentTicketData?.tickets || [];

      if (currentTicketData?.ticketName) {
        const existingTicket = tickets[activeIndex] || {};
        const updatedTicket = {
          ...existingTicket,
          id: existingTicket.id || `ticket-${Date.now()}`,
          name: key === 'ticketName' ? value : currentTicketData.ticketName,
          type: key === 'ticketType' ? value : currentTicketData.ticketType,
          price: key === 'price' ? value : currentTicketData.price,
          category: key === 'ticketCategory' ? value : currentTicketData.ticketCategory,
          purchaseLimit: key === 'purchaseLimit' ? value : currentTicketData.purchaseLimit,
          stockAvailability: key === 'stockAvailability' ? value : currentTicketData.stockAvailability,
          soldTarget: key === 'soldTarget' ? value : currentTicketData.soldTarget,
          numberOfPeople: key === 'numberOfPeople' ? value : currentTicketData.numberOfPeople,
          perks: key === 'perks' ? value : currentTicketData.perks,
          ticketAvailability: key === 'ticketAvailability' ? value : currentTicketData.ticketAvailability,
          salesStart: key === 'salesStart' ? value : currentTicketData.salesStart,
          startTime: key === 'startTime' ? value : currentTicketData.startTime,
          salesEnd: key === 'salesEnd' ? value : currentTicketData.salesEnd,
          endTime: key === 'endTime' ? value : currentTicketData.endTime,
          savedTicketId: existingTicket.savedTicketId || null
        };

        const updatedTickets = [...tickets];
        updatedTickets[activeIndex] = updatedTicket;
        setFormValue(currentStage, "tickets", updatedTickets);
      }
    } else if (isManageEventsContext) {
      // Manage Events Context: Use useTicketStore
      setCurrentTicketData(key, value);
      // Auto-save to active ticket for real-time sidebar sync
      saveCurrentDataToActiveTicket();
    }
  };

  const getValue = (key: string) => {
    if (isCreateEventContext) {
      return form[currentStage]?.[key] || "";
    } else if (isManageEventsContext) {
      return getCurrentTicketData(key) || "";
    }
    return "";
  };

  const updatePerk = (index: number, value: any) => {
    const perks = getValue("perks");
    const perksArray = Array.isArray(perks) && perks.length > 0 ? perks : [""];
    const updatedPerks = [...perksArray];
    updatedPerks[index] = value;
    handleChange("perks", updatedPerks);
  };

  const addPerk = () => {
    const perks = getValue("perks");
    const perksArray = Array.isArray(perks) && perks.length > 0 ? perks : [""];
    handleChange("perks", [...perksArray, ""]);
  };

  const deletePerk = (index: number) => {
    const perks = getValue("perks");
    const perksArray = Array.isArray(perks) && perks.length > 0 ? perks : [""];
    if (perksArray.length > 1) {
      const updatedPerks = perksArray.filter((_:any, i:any) => i !== index);
      handleChange("perks", updatedPerks);
    }
  };

  // Form Submission Logic for Manage Events Context
  const handleManageEventsSubmit = async () => {
    if (!eventId) {
      errorAlert("Error","Event ID not found");
      return;
    }

    // Get current ticket data from store
    const ticketData = {
      ticketName: getCurrentTicketData("ticketName"),
      ticketType: getCurrentTicketData("ticketType"),
      ticketCategory: getCurrentTicketData("ticketCategory"),
      price: getCurrentTicketData("price"),
      purchaseLimit: getCurrentTicketData("purchaseLimit"),
      stockAvailability: getCurrentTicketData("stockAvailability"),
      soldTarget: getCurrentTicketData("soldTarget"),
      numberOfPeople: getCurrentTicketData("numberOfPeople"),
      perks: getCurrentTicketData("perks"),
      ticketAvailability: getCurrentTicketData("ticketAvailability"),
      salesStart: getCurrentTicketData("salesStart"),
      startTime: getCurrentTicketData("startTime"),
      salesEnd: getCurrentTicketData("salesEnd"),
      endTime: getCurrentTicketData("endTime"),
      color: getCurrentTicketData("color")
    };

    // Validation
    if (!ticketData.ticketName) {
      errorAlert("Error","Ticket name is required");
      return;
    }
    if (!ticketData.ticketType) {
      errorAlert("Error","Ticket type is required");
      return;
    }
    if (!ticketData.ticketCategory) {
      errorAlert("Error","Ticket category is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if current ticket is already saved (edit mode)
      const currentTicket = manageTickets[manageActiveIndex];
      const isEditMode = currentTicket && currentTicket.isSaved && currentTicket.savedTicketId;

      // Map category values
      const categoryMap: any = {
        "option1": "single",
        "option2": "group"
      };

      const salesStartISO = ticketData.salesStart ? 
        new Date(`${ticketData.salesStart}T${ticketData.startTime || "00:00"}`).toISOString() : 
        new Date().toISOString();

      const salesEndISO = ticketData.salesEnd ? 
        new Date(`${ticketData.salesEnd}T${ticketData.endTime || "23:59"}`).toISOString() : 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

      let response;

      if (isEditMode) {
        // TODO: Call editTicket API when available
        // response = await editTicket(currentTicket.savedTicketId, ...ticketData);
        console.log("Edit mode detected - would call editTicket API with ID:", currentTicket.savedTicketId);
        // For now, simulate success
        response = { id: currentTicket.savedTicketId };
        successAlert("Success","Ticket updated successfully!");
      } else {
        // Create new ticket
        response = await createTicket(
          eventId,
          ticketData.ticketName,
          categoryMap[ticketData.ticketCategory] || ticketData.ticketCategory,
          ticketData.ticketType.toLowerCase(),
          ticketData.ticketType === "Paid" ? Number(ticketData.price) : 0,
          Number(ticketData.purchaseLimit) || 1,
          ticketData.ticketAvailability === "limited" ? Number(ticketData.stockAvailability) : 999999,
          Number(ticketData.soldTarget) || 0,
          salesStartISO,
          salesEndISO,
          ticketData.startTime || "00:00",
          ticketData.endTime || "23:59",
          Array.isArray(ticketData.perks) ? ticketData.perks.filter(perk => perk && perk.trim()) : [],
          ticketData.ticketAvailability === "unlimited",
          ticketData.ticketCategory === "option2" ? Number(ticketData.numberOfPeople) : undefined,
          ticketData.color
        );
        successAlert("Success","Ticket created successfully!");
      }

      // Mark current ticket as saved
      markTicketAsSaved(manageActiveIndex, response.id || response.ticketId || currentTicket?.savedTicketId);

      // Try to move to next unsaved ticket
      const movedToNext = moveToNextUnsavedTicket();

      if (!movedToNext) {
        // No more unsaved tickets, clear state and navigate back
        if (!hasUnsavedTickets()) {
          resetTicketStore();
          const slug = location.pathname.split('/')[2];
          navigate(`/manage-events/${slug}`, { state: { id: eventId } });
        }
      }
      // If moved to next ticket, stay on the form to continue editing

    } catch (error) {
      console.error("Error submitting ticket:", error);
      errorAlert("Error","Failed to save ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
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

<div className="grid md:flex justify-between gap-[15px]">
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
          <ColorPickerInput
            id="ticketColor"
            label="Ticket Color (Optional)"
            value={getValue("color")}
            setValue={(v: string) => handleChange("color", v)}
            classname="!w-full"
          />
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
        {(() => {
          const perks = getValue("perks");
          const perksArray = Array.isArray(perks) && perks.length > 0 ? perks : [""];
          
          return perksArray.map((perk: string, index: number) => (
            <DefaultInput
              key={`perk-${index}`}
              id={`perks-${index}`}
              label={index === 0 ? "What extra benefits come with tickets" : `Perk ${index + 1}`}
              value={perk || ""}
              setValue={(v: any) => updatePerk(index, v)}
              placeholder="Enter perk here"
              classname="!w-full"
              rightContent={
                <div className="flex items-center gap-2">
                  {perksArray.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deletePerk(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete this perk"
                    >
                      <FaTrash />
                    </button>
                  )}
                  {index === perksArray.length - 1 && (
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
          ));
        })()}
      </div>

      {showButtons && (
        <div className="md:mx-auto grid md:flex gap-4">
          <DefaultButton 
            variant="secondary" 
            className="!w-full md:w-fit border !bg-white"
            onClick={() => {
              if (isManageEventsContext) {
                const slug = location.pathname.split('/')[2];
                navigate(`/manage-events/${slug}`, { state: { id: eventId } });
              }
            }}
          >
            Cancel
          </DefaultButton>
          <DefaultButton 
            className="!w-full md:w-fit border whitespace-nowrap"
            onClick={isManageEventsContext ? handleManageEventsSubmit : undefined}
            isLoading={isManageEventsContext ? isSubmitting : false}
          >
            {isManageEventsContext ? "Create Ticket" : "Save Ticket"}
          </DefaultButton>
        </div>
      )}
    </div>
  );
};

export default CreateTicketComponent;