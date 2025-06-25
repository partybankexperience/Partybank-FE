import DefaultButton from "../buttons/DefaultButton";
import DefaultInput from "../inputs/DefaultInput";
import { useLocation, useNavigate } from "react-router-dom";
import RadioButton from "../inputs/RadioButton";
import { useEventStore } from "../../stores/useEventStore";
import { useTicketStore } from "../../stores/useTicketStore";
import { NumericFormat } from 'react-number-format';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { createTicket } from "../../Containers/ticketApi";
import { useState, useRef, useEffect } from "react";
import { successAlert, errorAlert } from "../alerts/ToastService";
import { convertISOToDateInput, convertDateInputToISO } from '../helpers/dateTimeHelpers';
import { formatPrice } from '../helpers/numberFormatHelpers';
import ColorPickerInput from "../inputs/ColorPickerInput";




const CreateTicketComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Context Detection
  const isCreateEventContext = location.pathname.includes('/dashboard/create-event');
  const isManageEventsContext = location.pathname.includes('/manage-events') && location.pathname.includes('/create-ticket');

  const showButtons = !isCreateEventContext;

  // State Management Logic - Context Aware
  const { form, setFormValue, errors } = useEventStore();
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
  const ticketErrors = errors[currentStage] || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for focus management
  const ticketCategoryRef = useRef<any>(null);
  const ticketTypeRef = useRef<any>(null);
  const ticketAvailabilityRef = useRef<any>(null);
  const ticketNameRef = useRef<any>(null);
  const purchaseLimitRef = useRef<any>(null);
  const totalStockRef = useRef<any>(null);
  const priceRef = useRef<any>(null);
  const soldTargetRef = useRef<any>(null);
  const groupSizeRef = useRef<any>(null);
  const ticketColorRef = useRef<any>(null);
  const salesStartRef = useRef<any>(null);
  const startTimeRef = useRef<any>(null);
  const salesEndRef = useRef<any>(null);
  const endTimeRef = useRef<any>(null);
  const perksRef = useRef<any>(null);
  
  console.log(form, 'the whole form')

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
  const availabilityType = ["Limited", "Unlimited"];

  const handleChange = (key: string, value: any) => {
    // Convert date input values to ISO format for storage
    let processedValue = value;
    if ((key === 'salesStart' || key === 'salesEnd') && value) {
      // For date fields, convert back to ISO format with time
      const timeKey = key === 'salesStart' ? 'startTime' : 'endTime';
      const timeValue = getValue(timeKey) || '00:00';
      processedValue = convertDateInputToISO(value, timeValue);
    }
    
    if (isCreateEventContext) {
      // Create Event Context: Use existing useEventStore logic
      setFormValue(currentStage, key, processedValue);

      // Auto-save current ticket data to the tickets array
      const currentTicketData = form[currentStage];
      const activeIndex = currentTicketData?.activeTicketIndex || 0;
      const tickets = currentTicketData?.tickets || [];

      if (currentTicketData?.ticketName) {
        const existingTicket = tickets[activeIndex] || {};
        const updatedTicket = {
          ...existingTicket,
          id: existingTicket.id,
          name: key === 'ticketName' ? value : currentTicketData.ticketName,
          type: key === 'ticketType' ? value : currentTicketData.ticketType,
          price: key === 'price' ? value : currentTicketData.price,
          category: key === 'ticketCategory' ? value : currentTicketData.ticketCategory,
          purchaseLimit: key === 'purchaseLimit' ? value : currentTicketData.purchaseLimit,
          totalStock: key === 'totalStock' ? value : currentTicketData.totalStock,
          soldTarget: key === 'soldTarget' ? value : currentTicketData.soldTarget,
          groupSize: key === 'groupSize' ? value :   currentTicketData.groupSize,
          perks: key === 'perks' ? value : currentTicketData.perks,
          isUnlimited: key === 'isUnlimited' ? value : Boolean(currentTicketData.isUnlimited) ,
          salesStart: key === 'salesStart' ? processedValue : currentTicketData.salesStart,
          startTime: key === 'startTime' ? value : currentTicketData.startTime,
          salesEnd: key === 'salesEnd' ? processedValue : currentTicketData.salesEnd,
          endTime: key === 'endTime' ? value : currentTicketData.endTime,
          color:key==='color' ? value : currentTicketData.color,
          savedTicketId: existingTicket.savedTicketId || null
        };
        const updatedTickets = [...tickets];
        updatedTickets[activeIndex] = updatedTicket;
        setFormValue(currentStage, "tickets", updatedTickets);
      }
    } else if (isManageEventsContext) {
      // Manage Events Context: Use useTicketStore
      setCurrentTicketData(key, processedValue);
      // Auto-save to active ticket for real-time sidebar sync
      saveCurrentDataToActiveTicket();

    }

  };

  const getValue = (key: string) => {
    let value = "";
    if (isCreateEventContext) {
      value = form[currentStage]?.[key] || "";
    } else if (isManageEventsContext) {
      value = getCurrentTicketData(key) || "";
    }
    
    // Convert ISO dates to date input format for date fields
    if ((key === 'salesStart' || key === 'salesEnd') && value && value.includes('T')) {
      return convertISOToDateInput(value);
    }
    
    // Map backend field names to frontend field names
    if (key === 'ticketName') {
      return getCurrentTicketData('name') || value;
    }
    
    if (key === 'totalStock') {
      return getCurrentTicketData('totalStock') || value;
    }
    
    if (key === 'groupSize') {
      return getCurrentTicketData('groupSize') || value;
    }
    
    if (key === 'ticketCategory') {
      const category = getCurrentTicketData('category') || value;
      if (category === 'single') return 'option1';
      if (category === 'group') return 'option2';
      return value;
    }
    
    if (key === 'ticketType') {
      const type = getCurrentTicketData('type') || value;
      if (type === 'free') return 'Free';
      if (type === 'paid') return 'Paid';
      return value;
    }
    
    if (key === 'isUnlimited') {
      const isUnlimited = value ?? getCurrentTicketData('isUnlimited');
    
      return String(isUnlimited).toLowerCase() === 'true';
    }
    
    
    if (key === 'color') {
      return getCurrentTicketData('color') || value;
    }
    return value;
  };
  console.log(getValue('color'),'the color value is here')
  console.log("Retrieved color value:", form[currentStage]?.color || getCurrentTicketData('color'));

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
      ticketName: getCurrentTicketData("name"),
      ticketType: getCurrentTicketData("type"),
      ticketCategory: getCurrentTicketData("category"),
      price: getCurrentTicketData("price"),
      purchaseLimit: getCurrentTicketData("purchaseLimit"),
      totalStock: getCurrentTicketData("totalStock"),
      soldTarget: getCurrentTicketData("soldTarget"),
      groupSize: getCurrentTicketData("groupSize"),
      perks: getCurrentTicketData("perks"),
      isUnlimited: Boolean(getCurrentTicketData("isUnlimited")),
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
          !ticketData.isUnlimited ? Number(ticketData.totalStock) : 0,
          Number(ticketData.soldTarget) || 0,
          salesStartISO,
          salesEndISO,
          ticketData.startTime || "00:00",
          ticketData.endTime || "23:59",
          Array.isArray(ticketData.perks) ? ticketData.perks.filter(perk => perk && perk.trim()) : [],
          ticketData.isUnlimited,
          Number(ticketData.groupSize),
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
const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(ticketErrors).length > 0) {
      setTimeout(() => {
        if (ticketErrors.ticketCategory && ticketCategoryRef.current) {
          ticketCategoryRef.current.focus();
        } else if (ticketErrors.ticketType && ticketTypeRef.current) {
          ticketTypeRef.current.focus();
        } else if (ticketErrors.isUnlimited && ticketAvailabilityRef.current) {
          ticketAvailabilityRef.current.focus();
        } else if (ticketErrors.ticketName && ticketNameRef.current) {
          ticketNameRef.current.focus();
        } else if (ticketErrors.purchaseLimit && purchaseLimitRef.current) {
          purchaseLimitRef.current.focus();
        } else if (ticketErrors.totalStock && totalStockRef.current) {
          totalStockRef.current.focus();
        } else if (ticketErrors.price && priceRef.current) {
          priceRef.current.focus();
        } else if (ticketErrors.soldTarget && soldTargetRef.current) {
          soldTargetRef.current.focus();
        } else if (ticketErrors.groupSize && groupSizeRef.current) {
          groupSizeRef.current.focus();
        } else if (ticketErrors.color && ticketColorRef.current) {
          ticketColorRef.current.focus();
        } else if (ticketErrors.salesStart && salesStartRef.current) {
          salesStartRef.current.focus();
        } else if (ticketErrors.startTime && startTimeRef.current) {
          startTimeRef.current.focus();
        } else if (ticketErrors.salesEnd && salesEndRef.current) {
          salesEndRef.current.focus();
        } else if (ticketErrors.endTime && endTimeRef.current) {
          endTimeRef.current.focus();
        } else if (ticketErrors.perks && perksRef.current) {
          perksRef.current.focus();
        }
      }, 100);
    }

    return Object.keys(ticketErrors).length === 0;
  };

  // Export validation function for external use
  useEffect(() => {
    (window as any).validateTicketsCreate = validateForm;
    return () => {
      delete (window as any).validateTicketsCreate;
    };
  }, [form[currentStage]]);

console.log(getValue("isUnlimited"),'checking ')
  return (
    <div className="grid gap-[2.5rem] mt-[20px]">
      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Category</h2>
        <div
          role="radiogroup"
          aria-label="Select an option"
          className="grid md:flex gap-4"
          ref={ticketCategoryRef}
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
        {ticketErrors.ticketCategory && (
          <p className="text-[13px] text-red-500 mt-1">
            {ticketErrors.ticketCategory}
          </p>
        )}
      </div>

<div className="grid md:flex justify-between gap-[15px]">
      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Type</h2>
        <div 
          className="grid md:flex gap-4 md:gap-[2.5rem]"
          ref={ticketTypeRef}
        >
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
        {ticketErrors.ticketType && (
          <p className="text-[13px] text-red-500 mt-1">
            {ticketErrors.ticketType}
          </p>
        )}
      </div>

      <div className="grid gap-[15px]">
        <h2 className="text-black text-[1.2rem] font-bold">Ticket Availability</h2>
        <div 
          className="grid md:flex gap-4 md:gap-[2.5rem]"
          ref={ticketAvailabilityRef}
        >
        {availabilityType.map((availability) => {
  const isUnlimited = availability === "Unlimited";
  
  return (
    <RadioButton
      key={availability}
      label={availability}
      value={availability}
      name="ticket-availability"
      checked={!!getValue("isUnlimited") === isUnlimited}
      onChange={() => handleChange("isUnlimited", isUnlimited)}
    />
  );
})}

        </div>
        {ticketErrors.isUnlimited && (
          <p className="text-[13px] text-red-500 mt-1">
            {ticketErrors.isUnlimited}
          </p>
        )}
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
            required
            helperText={ticketErrors.ticketName || ""}
            style={ticketErrors.ticketName ? "border-red-500" : ""}
            ref={ticketNameRef}
          />
          <DefaultInput
            id="purchaseLimit"
            label="Purchase Limit"
            value={getValue("purchaseLimit")}
            setValue={(v:any) => handleChange("purchaseLimit", v)}
            placeholder="1"
            classname="!w-full"
            type="number"
            required
            helperText={ticketErrors.purchaseLimit || ""}
            style={ticketErrors.purchaseLimit ? "border-red-500" : ""}
            ref={purchaseLimitRef}
          />
          {!getValue("isUnlimited") && (
            <DefaultInput
              id="totalStock"
              label="Stock Availability"
              value={getValue("totalStock")}
              setValue={(v:any) => handleChange("totalStock", v)}
              placeholder="Enter stock quantity"
              classname="!w-full"
              type="number"
              required
              helperText={ticketErrors.totalStock || ""}
              style={ticketErrors.totalStock ? "border-red-500" : ""}
              ref={totalStockRef}
            />
          )}
          {getValue("ticketType") === "Paid" && (
            <div className="grid gap-1 w-full relative">
              <label className="text-[#231F20] text-[16px] font-semibold font-[RedHat]">
                Price *
              </label>
              <div className="relative">
                <NumericFormat
                  // ref={priceRef}
                  value={getValue("price")}
                  onValueChange={(values) => {
                    handleChange("price", values.floatValue || 0);
                  }}
                  thousandSeparator=","
                  prefix="₦"
                  placeholder="₦0.00"
                  className={`text-[14px] border-[1px] text-black placeholder:text-neutralDark placeholder:text-[14px] font-[RedHat] rounded-[4px] py-[10px] px-[16px] !w-full bg-white hover:border-lightPurple focus:border-lightPurple hover:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] focus:shadow-[0_0_0_2px_rgba(77,64,85,0.1)] ${ticketErrors.price ? 'border-red-500' : 'border-neutral'}`}
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                />
                {getValue("price") && Number(getValue("price")) >= 10000 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                    {formatPrice(getValue("price"))}
                  </div>
                )}
              </div>
              {ticketErrors.price && (
                <p className="text-[13px] text-red-500 mt-1">
                  {ticketErrors.price}
                </p>
              )}
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
            helperText={ticketErrors.soldTarget || ""}
            style={ticketErrors.soldTarget ? "border-red-500" : ""}
            ref={soldTargetRef}
          />
          {getValue("ticketCategory") === "option2" && (
            <DefaultInput
              id="groupSize"
              label="Number of people"
              value={getValue("groupSize")}
              setValue={(v:any) => handleChange("groupSize", v)}
              placeholder="Enter number of people"
              classname="!w-full"
              type="number"
              required
              helperText={ticketErrors.groupSize || ""}
              style={ticketErrors.groupSize ? "border-red-500" : ""}
              ref={groupSizeRef}
            />
          )}
          <ColorPickerInput
            id="ticketColor"
            label="Ticket Color"
            value={getValue("color")}
            setValue={(v: string) => handleChange("color", v)}
            classname="!w-full"
            // helperText={ticketErrors.color || ""}
            // style={ticketErrors.color ? "border-red-500" : ""}
            // ref={ticketColorRef}
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
            required
            helperText={ticketErrors.salesStart || ""}
            style={ticketErrors.salesStart ? "border-red-500" : ""}
            ref={salesStartRef}
          />
          <DefaultInput
            id="startTime"
            label="Start Time"
            value={getValue("startTime")}
            setValue={(v:any) => handleChange("startTime", v)}
            placeholder="08:00"
            classname="!w-full"
            type="time"
            required
            helperText={ticketErrors.startTime || ""}
            style={ticketErrors.startTime ? "border-red-500" : ""}
            ref={startTimeRef}
          />
          <DefaultInput
            id="salesEnd"
            label="Sales End"
            value={getValue("salesEnd")}
            setValue={(v:any) => handleChange("salesEnd", v)}
            placeholder="16/04/2025"
            classname="!w-full"
            type="date"
            required
            helperText={ticketErrors.salesEnd || ""}
            style={ticketErrors.salesEnd ? "border-red-500" : ""}
            ref={salesEndRef}
            min={getValue("salesStart")}
          />
          <DefaultInput
            id="endTime"
            label="End Time"
            value={getValue("endTime")}
            setValue={(v:any) => handleChange("endTime", v)}
            placeholder="18:00"
            classname="!w-full"
            type="time"
            required
            helperText={ticketErrors.endTime || ""}
            style={ticketErrors.endTime ? "border-red-500" : ""}
            ref={endTimeRef}
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
              helperText={index === 0 && ticketErrors.perks ? ticketErrors.perks : ""}
              style={index === 0 && ticketErrors.perks ? "border-red-500" : ""}
              ref={index === 0 ? perksRef : undefined}
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