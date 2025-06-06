import { useState, useEffect, useMemo } from "react";
import DefaultInput from "../../components/inputs/DefaultInput";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { ImageUploadInput } from "../../components/inputs/ImageInput";
import { useEventStore } from "../../stores/useEventStore";
import { getTags, createTag } from "../../Containers/eventApi";
import type { Options } from "easymde";

const EventSetup = () => {
  const { form, setFormValue } = useEventStore();
  const eventSetupForm = form["Event Setup"] || {};
  const [tags, setTags] = useState<string[]>([]);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventSetupErrors, setEventSetupErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags();
        if (response && response.length > 0) {
          const tagNames = response.map((tag: any) => tag.name);
          setTags([...tagNames, "Other"]);
        } else {
          setTags(["Other"]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags(["Other"]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleImage = (file: File | null) => {
    if (file) {
      console.log("Uploaded image:", file.name);
      setFormValue("Event Setup", "coverImage", file)
    }
  };

  const handleTagChange = (selectedTag: string) => {
    setFormValue("Event Setup", "tags", selectedTag);
    if (selectedTag === "Other") {
      setShowCreateTag(true);
    } else {
      setShowCreateTag(false);
      // Reset the new tag fields when not selecting "Other"
      setNewTagName("");
      setNewTagDescription("");
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      setIsCreatingTag(true);
      await createTag(newTagName, newTagDescription || "");

      // Add the new tag to the tags array and select it
      const updatedTags = [...tags.filter(tag => tag !== "Other"), newTagName, "Other"];
      setTags(updatedTags);
      setFormValue("Event Setup", "tags", newTagName);

      // Reset form and hide create tag section
      setNewTagName("");
      setNewTagDescription("");
      setShowCreateTag(false);
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsCreatingTag(false);
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

  const handleInputChange = (key: string, value: string) => {
    setFormValue("Event Setup", key, value);
    setEventSetupErrors(prevErrors => ({ ...prevErrors, [key]: "" }));
  };

  console.log(eventSetupForm);
  return (
    <div className="grid gap-[20px]">
      <DefaultInput
          id="name"
          label="Event Name"
          value={eventSetupForm.name || ""}
          setValue={(value: string) => handleInputChange("name", value)}
          placeholder="Enter event name"
          required
          helperText={eventSetupErrors.name || ""}
          style={eventSetupErrors.name ? "border-red-500" : ""}
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
            onChange={(value) => handleInputChange("description", value)}
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
          setValue={(value: string) => handleInputChange("category", value)}
          required
          helperText={eventSetupErrors.category || ""}
          style={eventSetupErrors.category ? "border-red-500" : ""}
        />
        <DefaultInput
          id="Tags"
          label="Tags"
          value={eventSetupForm.tags || ""}
          setValue={handleTagChange}
          placeholder={loading ? "Loading tags..." : "Select Tag"}
          classname="!w-full"
          showDropdown
          dropdownOptions={tags}
          disabled={loading}
          required
          helperText={eventSetupErrors.tags || ""}
          style={eventSetupErrors.tags ? "border-red-500" : ""}
        />

      {eventSetupForm.tags === "Other" && (
        <>
          <DefaultInput
            id="newTagName"
            label="Create New Tag"
            value={newTagName}
            setValue={setNewTagName}
            placeholder="Enter new tag name"
            classname="!w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTagName.trim()) {
                handleCreateTag();
              }
            }}
          />
          <DefaultInput
            id="newTagDescription"
            label="Tag Description (Optional)"
            value={newTagDescription}
            setValue={setNewTagDescription}
            placeholder="Enter tag description"
            classname="!w-full"
          />
        </>
      )}
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
            id="contactNumber"
            label="Organizer’s Contact Number"
            value={eventSetupForm.contactNumber || ""}
            setValue={(value: string) => handleInputChange("contactNumber", value)}
            type="tel"
            placeholder="Enter contact number"
            classname="!w-full"
            required
            helperText={eventSetupErrors.contactNumber || ""}
            style={eventSetupErrors.contactNumber ? "border-red-500" : ""}
          />
      <ImageUploadInput onImageChange={handleImage} />
    </div>
  );
};

export default EventSetup;