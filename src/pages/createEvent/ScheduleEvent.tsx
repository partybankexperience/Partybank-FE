import { useState } from "react";
import RadioButton from "../../components/inputs/RadioButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MapWithAutocomplete } from "../../components/map/Map";
import { useEventStore } from "../../stores/useEventStore";

const ScheduleEvent = () => {
//   const [selected, setSelected] = useState("");
  const eventType = ["Single day", "Multiple Day"];
  const { form, setFormValue } = useEventStore();
  const scheduleEventForm = form["Schedule & Location"] || {};
  const selected = scheduleEventForm.eventType || "";
  return (
    <div>
      <div className="grid gap-[20px]">
        <h2 className="text-black text-[1.2rem]">Event Type</h2>
        <div
          role="radiogroup"
          aria-label="Select an option"
          className="grid md:flex gap-4 md:gap-[2.5rem]"
        >
          {eventType.map((label, idx) => (
            <RadioButton
              key={`option${idx}`}
              label={label}
              value={label}
              name="eventType"
              checked={selected === label}
              onChange={(val) => {
                // setSelected(val);
                setFormValue("Schedule & Location", "eventType", val);
              }}
            />
          ))}
        </div>

        {/* Date & Time Section */}
        <div className="grid md:grid-cols-[1fr_.5fr_.5fr] gap-[20px]">
          <DefaultInput
            type="date"
            id="startDate"
            label="Start Date"
            value={scheduleEventForm.startDate || ""}
            setValue={(val: any) => setFormValue("Schedule & Location", "startDate", val)}
            placeholder="12/04/2025"
            classname="!w-full"
            rightContent={<MdOutlineCalendarMonth className="text-black text-[1rem]" />}
          />
          <DefaultInput
            type="time"
            id="startTime"
            label="Start Time"
            value={scheduleEventForm.startTime || ""}
            setValue={(val: any) => setFormValue("Schedule & Location", "startTime", val)}
            placeholder="08:00 AM"
            classname="!w-full"
            rightContent={<FaRegClock className="text-black text-[1rem]" />}
          />
          <DefaultInput
            type="time"
            id="endTime"
            label="End Time"
            value={scheduleEventForm.endTime || ""}
            setValue={(val: any) => setFormValue("Schedule & Location", "endTime", val)}
            placeholder="08:00 PM"
            classname="!w-full"
            rightContent={<FaRegClock className="text-black text-[1rem]" />}
          />
        </div>

        {/* Only show if Multiple Day */}
        {selected === "Multiple Day" && (
          <div className="grid md:grid-cols-[1fr_.5fr_.5fr] gap-[20px]">
            <DefaultInput
              type="date"
              id="endDate"
              label="End Date"
              value={scheduleEventForm.endDate || ""}
              setValue={(val: any) => setFormValue("Schedule & Location", "endDate", val)}
              placeholder="13/04/2025"
              classname="!w-full"
              rightContent={<MdOutlineCalendarMonth className="text-black text-[1rem]" />}
            />
            <DefaultInput
              type="time"
              id="multiStartTime"
              label="Start Time "
              value={scheduleEventForm.multiStartTime || ""}
              setValue={(val: any) => setFormValue("Schedule & Location", "multiStartTime", val)}
              placeholder="08:00 AM"
              classname="!w-full"
              rightContent={<FaRegClock className="text-black text-[1rem]" />}
            />
            <DefaultInput
              type="time"
              id="multiEndTime"
              label="End Time "
              value={scheduleEventForm.multiEndTime || ""}
              setValue={(val: any) => setFormValue("Schedule & Location", "multiEndTime", val)}
              placeholder="08:00 PM"
              classname="!w-full"
              rightContent={<FaRegClock className="text-black text-[1rem]" />}
            />
          </div>
        )}

        {/* Venue Info */}
        <DefaultInput
          id="venueName"
          label="Venue Name"
          value={scheduleEventForm.venueName || ""}
          setValue={(val: any) => setFormValue("Schedule & Location", "venueName", val)}
          placeholder="e.g., Landmark Centre"
          classname="!w-full"
        />
        <DefaultInput
          id="address"
          label="Event Address"
          value={scheduleEventForm.address || ""}
          setValue={(val: any) => setFormValue("Schedule & Location", "address", val)}
          placeholder="Enter full location details"
          classname="!w-full"
        />

        {/* Map Autocomplete */}
        <MapWithAutocomplete />
      </div>
    </div>
  );
};

export default ScheduleEvent;
