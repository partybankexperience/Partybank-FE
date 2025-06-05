// import { useState } from "react";
import DefaultInput from "../../components/inputs/DefaultInput";
// import DescriptionEditor from "../../components/inputs/DescriptionEditor"
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { ImageUploadInput } from "../../components/inputs/ImageInput";
import { useEventStore } from "../../stores/useEventStore";
import { useMemo } from "react";
import type { Options } from "easymde";

const EventSetup = () => {
  const { form, setFormValue } = useEventStore();
  const eventSetupForm = form["Event Setup"] || {};
  const handleImage = (file: File | null) => {
    if (file) {
      console.log("Uploaded image:", file.name);
      setFormValue("Event Setup", "coverImage", file)
    }
  };
  const options: Options = useMemo(() => ({
    placeholder: "Type here...",
    spellChecker: false,
    toolbar: [
      "bold",
      "italic",
      "unordered-list",
      "ordered-list",
      "|",
      "link",
      "image",
      "preview",
    ] as const, // 👈 Important for satisfying the `readonly` type
  }), []);
  console.log(eventSetupForm);
  return (
    <div className="grid gap-[20px]">
      <DefaultInput
        id="Name"
        label="Event Name"
        value={eventSetupForm.name || ""}
        setValue={(val: any) => setFormValue("Event Setup", "name", val)}
        placeholder="Enter event name"
        classname="!w-full"
      />
      <div className="grid">
        <label htmlFor="description">
          <p className="text-black ">Event Descriptions</p>
        </label>
        <SimpleMDE
          // value={description}
          // onChange={(value) => setDescription(value)}
          value={eventSetupForm.description || ""}
          onChange={(val) => setFormValue("Event Setup", "description", val)}
          options={options}
          id="description"
        />
      </div>

      <DefaultInput
        id="Category"
        label="Category"
        placeholder="Festival"
        classname="!w-full"
        showDropdown
        dropdownOptions={["Festival", "Concert", "Conference"]}
        value={eventSetupForm.category || ""}
        setValue={(val: any) => setFormValue("Event Setup", "category", val)}
      />
      <DefaultInput
        id="Tags"
        label="Tags"
        value={eventSetupForm.tags || ""}
        setValue={(val: any) => setFormValue("Event Setup", "tags", val)}
        placeholder="Enter Tags"
        classname="!w-full"
        showDropdown
        dropdownOptions={["Festival", "Concert", "Conference"]}
      />
      <DefaultInput
        id="Series"
        label="Series"
        value={eventSetupForm.series || ""}
        setValue={(val: any) => setFormValue("Event Setup", "series", val)}
        placeholder="Enter Series"
        classname="!w-full"
        showDropdown
        dropdownOptions={["Series 1", "Series 2", "Series 3"]}
      />
      <DefaultInput
        id="Organizer’s Contact Number"
        label="Organizer’s Contact Number"
        value={eventSetupForm.contactNumber || ""}
        setValue={(val: any) =>
          setFormValue("Event Setup", "contactNumber", val)
        }
        type="tel"
        //   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        placeholder="Enter contact number "
        classname="!w-full"
      />
      <ImageUploadInput onImageChange={handleImage} />
    </div>
  );
};

export default EventSetup;
