
import { useState, useEffect, useRef } from "react";
import RadioButton from "../../components/inputs/RadioButton";
import DefaultInput from "../../components/inputs/DefaultInput";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MapWithAutocomplete } from "../../components/map/Map";
import { useEventStore } from "../../stores/useEventStore";
import SlideToggle from "../../components/inputs/SlideToggle";
import "leaflet/dist/leaflet.css";

const ScheduleEvent = () => {
  const eventType = [
    { label: "Single day", value: "single-day" },
    { label: "Multiple Day", value: "multi-day" }
  ];
  const { form, setFormValue, errors } = useEventStore();
  const scheduleEventForm = form["Schedule & Location"] || {};
  const scheduleEventErrors = errors["Schedule & Location"] || {};
  const selected = scheduleEventForm.eventType || "";
  const [showLocation, setShowLocation] = useState(() => {
    // Determine initial state based on existing data
    if (scheduleEventForm.showLocation !== undefined) {
      return scheduleEventForm.showLocation;
    }
    // If there's venue name or location data, show location should be true
    return !!(scheduleEventForm.venueName || scheduleEventForm.selectedLocation || scheduleEventForm.address);
  });

  const eventTypeRef = useRef<any>(null);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const startTimeRef = useRef<any>(null);
  const endTimeRef = useRef<any>(null);
  const venueNameRef = useRef<any>(null);

  // Sync showLocation state with form data and existing location info
  useEffect(() => {
    if (scheduleEventForm.showLocation !== undefined) {
      setShowLocation(scheduleEventForm.showLocation);
    } else {
      // Auto-enable location if there's existing location data
      const hasLocationData = !!(scheduleEventForm.venueName || scheduleEventForm.selectedLocation || scheduleEventForm.address);
      if (hasLocationData && !showLocation) {
        setShowLocation(true);
        setFormValue("Schedule & Location", "showLocation", true);
      }
    }
  }, [scheduleEventForm.showLocation, scheduleEventForm.venueName, scheduleEventForm.selectedLocation, scheduleEventForm.address]);

  const handleInputChange = (key: string, value: any) => {
    setFormValue("Schedule & Location", key, value);
  };

  const handleLocationToggle = (value: boolean) => {
    setShowLocation(value);
    setFormValue("Schedule & Location", "showLocation", value);
    // Clear location-related fields when toggling off
    if (!value) {
      setFormValue("Schedule & Location", "venueName", "");
      setFormValue("Schedule & Location", "selectedLocation", null);
      setFormValue("Schedule & Location", "address", null);
      setFormValue("Schedule & Location", "coordinates", null);
    }
  };
  const handleLocationSelect = (location: any) => {
    // Extract address components and format them according to the required structure
    const addressParts = location.name.split(', ');
    const address = {
      country: addressParts[addressParts.length - 1] || "",
      state: addressParts[addressParts.length - 2] || "",
      city: addressParts[addressParts.length - 3] || "",
      street: addressParts.slice(0, -3).join(', ') || addressParts[0] || "",
      postalCode: "" // This would need to be extracted from a more detailed geocoding response
    };

    setFormValue("Schedule & Location", "selectedLocation", location);
    setFormValue("Schedule & Location", "address", address);
    setFormValue("Schedule & Location", "coordinates", {
      lat: location.lat,
      lon: location.lon
    });
  };

  const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(scheduleEventErrors).length > 0) {
      setTimeout(() => {
        if (scheduleEventErrors.eventType && eventTypeRef.current) {
          eventTypeRef.current.focus();
        } else if (scheduleEventErrors.startDate && startDateRef.current) {
          startDateRef.current.focus();
        } else if (scheduleEventErrors.endDate && endDateRef.current) {
          endDateRef.current.focus();
        } else if (scheduleEventErrors.startTime && startTimeRef.current) {
          startTimeRef.current.focus();
        } else if (scheduleEventErrors.endTime && endTimeRef.current) {
          endTimeRef.current.focus();
        } else if (scheduleEventErrors.venueName && venueNameRef.current) {
          venueNameRef.current.focus();
        }
      }, 100);
    }

    // Store the current location state for validation
    setFormValue("Schedule & Location", "isLocationTBA", !showLocation);
    
    return Object.keys(scheduleEventErrors).length === 0;
  };

  // Export validation function for external use
  useEffect(() => {
    (window as any).validateScheduleEvent = validateForm;
    return () => {
      delete (window as any).validateScheduleEvent;
    };
  }, [scheduleEventForm]);

  return (
    <div>
      <div className="grid gap-[20px]">
        <h2 className="text-black text-[1.2rem]">Event Type</h2>
        <div
          role="radiogroup"
          aria-label="Select an option"
          className="grid md:flex gap-4 md:gap-[2.5rem]"
          ref={eventTypeRef}
        >
          {eventType.map((option, idx) => (
            <RadioButton
              key={`option${idx}`}
              label={option.label}
              value={option.value}
              name="eventType"
              checked={selected === option.value}
              onChange={(val) => {
                handleInputChange("eventType", val);
              }}
            />
          ))}
          {scheduleEventErrors.eventType && (
            <p className="text-[13px] text-red-500 mt-1">
              {scheduleEventErrors.eventType}
            </p>
          )}
        </div>

        {/* Date & Time Section */}
        <div className="grid md:grid-cols-[1fr_.5fr_.5fr] gap-[20px]">
          <DefaultInput
            type="date"
            id="startDate"
            label="Start Date"
            value={scheduleEventForm.startDate || ""}
            setValue={(val: any) => handleInputChange("startDate", val)}
            placeholder="12/04/2025"
            classname="!w-full"
            rightContent={<MdOutlineCalendarMonth className="text-black text-[1rem]" />}
            required
            helperText={scheduleEventErrors.startDate || ""}
            style={scheduleEventErrors.startDate ? "border-red-500" : ""}
            inputRef={startDateRef}
          />
          <DefaultInput
            type="time"
            id="startTime"
            label="Start Time"
            value={scheduleEventForm.startTime || ""}
            setValue={(val: any) => handleInputChange("startTime", val)}
            placeholder="08:00 AM"
            classname="!w-full"
            rightContent={<FaRegClock className="text-black text-[1rem]" />}
            required
            helperText={scheduleEventErrors.startTime || ""}
            style={scheduleEventErrors.startTime ? "border-red-500" : ""}
            inputRef={startTimeRef}
          />
          <DefaultInput
            type="time"
            id="endTime"
            label="End Time"
            value={scheduleEventForm.endTime || ""}
            setValue={(val: any) => handleInputChange("endTime", val)}
            placeholder="08:00 PM"
            classname="!w-full"
            rightContent={<FaRegClock className="text-black text-[1rem]" />}
            required
            helperText={scheduleEventErrors.endTime || ""}
            style={scheduleEventErrors.endTime ? "border-red-500" : ""}
            inputRef={endTimeRef}
          />
        </div>

        {/* Only show end date if Multiple Day */}
        {selected === "multi-day" && (
          <div className="grid md:grid-cols-[1fr_.5fr_.5fr] gap-[20px]">
            <DefaultInput
              type="date"
              id="endDate"
              label="End Date"
              value={scheduleEventForm.endDate || ""}
              setValue={(val: any) => handleInputChange("endDate", val)}
              placeholder="13/04/2025"
              classname="!w-full"
              rightContent={<MdOutlineCalendarMonth className="text-black text-[1rem]" />}
              required
              helperText={scheduleEventErrors.endDate || ""}
              style={scheduleEventErrors.endDate ? "border-red-500" : ""}
              inputRef={endDateRef}
            />
            <div className="md:col-span-2"></div>
          </div>
        )}

        {/* Location Toggle */}
        <div className="grid gap-[10px]">
          <h2 className="text-black text-[1.2rem]">Location</h2>
          <div className="flex items-center gap-4">
            <SlideToggle
              toggle={handleLocationToggle}
              isChecked={showLocation}
            />
            <span className="text-black text-[1rem]">
              {showLocation ? "Location will be provided" : "Location TBA (To Be Announced)"}
            </span>
          </div>
        </div>

        {/* Show venue and location inputs only if location toggle is on */}
        {showLocation && (
          <>
            <DefaultInput
              id="venueName"
              label="Venue Name"
              value={scheduleEventForm.venueName || ""}
              setValue={(val: any) => handleInputChange("venueName", val)}
              placeholder="e.g., Landmark Centre"
              classname="!w-full"
              required
              helperText={scheduleEventErrors.venueName || ""}
              style={scheduleEventErrors.venueName ? "border-red-500" : ""}
              inputRef={venueNameRef}
            />

            {/* Map Autocomplete */}
            <div className="grid gap-2">
              <label className="text-black text-[1rem] font-semibold">
                Event Location
              </label>
              <div className="w-full min-h-[400px]">
                <MapWithAutocomplete 
                  onSelect={handleLocationSelect}
                  defaultCenter={
                    scheduleEventForm.coordinates 
                      ? [scheduleEventForm.coordinates.lat, scheduleEventForm.coordinates.lon]
                      : undefined
                  }
                  prefilledLocation={scheduleEventForm.selectedLocation}
                />
              </div>
              {scheduleEventForm.selectedLocation && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Selected Location:</strong> {scheduleEventForm.selectedLocation.name}
                  </p>
                  {scheduleEventForm.address && (
                    <div className="text-xs text-gray-600 mt-1">
                      <p>Street: {scheduleEventForm.address.street}</p>
                      <p>City: {scheduleEventForm.address.city}</p>
                      <p>State: {scheduleEventForm.address.state}</p>
                      <p>Country: {scheduleEventForm.address.country}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleEvent;
