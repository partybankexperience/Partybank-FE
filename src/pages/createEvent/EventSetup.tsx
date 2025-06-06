import { useState, useEffect, useMemo, useRef } from "react";
import DefaultInput from "../../components/inputs/DefaultInput";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { ImageUploadInput } from "../../components/inputs/ImageInput";
import { useEventStore } from "../../stores/useEventStore";
import { getTags, createTag } from "../../Containers/eventApi";
import type { Options } from "easymde";
import { getSeries } from "../../Containers/seriesApi";

const EventSetup = () => {
  const { form, setFormValue } = useEventStore();
  const eventSetupForm = form["Event Setup"] || {};
  const [tags, setTags] = useState<string[]>([]);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [series, setSeries] = useState<any[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [eventSetupErrors, setEventSetupErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const contactNumberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setSeriesLoading(true);
        const response = await getSeries();
        setSeries(response || []);
      } catch (error) {
        console.error("Error fetching series:", error);
        setSeries([]);
      } finally {
        setSeriesLoading(false);
      }
    };

    fetchSeries();
  }, []);

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

  const handleImage = (imageUrl: string) => {
    console.log("Uploaded image URL:", imageUrl);
    setFormValue("Event Setup", "coverImage", imageUrl);
  };

  const handleTagChange = (selectedTag: string) => {
    console.log("Selected tag:", selectedTag);
    console.log("Current eventSetupForm.tags:", eventSetupForm.tags);
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

  const validateForm = () => {
    let errors: Record<string, string> = {};
    if (!eventSetupForm.name || eventSetupForm.name.trim() === "") {
      errors.name = "Event Name is required";
    }
    if (!eventSetupForm.category || eventSetupForm.category.trim() === "") {
      errors.category = "Category is required";
    }
    if (!eventSetupForm.tags || eventSetupForm.tags.trim() === "") {
      errors.tags = "Tag is required";
    }
    if (!eventSetupForm.contactNumber || eventSetupForm.contactNumber.trim() === "") {
      errors.contactNumber = "Contact Number is required";
    }
    if (!eventSetupForm.description || eventSetupForm.description.trim() === "") {
      errors.description = "Event Description is required";
    }

    setEventSetupErrors(errors);
    
    // Focus on first error
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        if (errors.name && nameRef.current) {
          nameRef.current.focus();
        } else if (errors.category && categoryRef.current) {
          categoryRef.current.focus();
        } else if (errors.tags && tagsRef.current) {
          tagsRef.current.focus();
        } else if (errors.contactNumber && contactNumberRef.current) {
          contactNumberRef.current.focus();
        }
      }, 100);
    }

    return Object.keys(errors).length === 0;
  };

  // Export validation function for external use
  useEffect(() => {
    (window as any).validateEventSetup = validateForm;
    return () => {
      delete (window as any).validateEventSetup;
    };
  }, [eventSetupForm]);

  console.log("EventSetup form data:", eventSetupForm);
  console.log("Current tags state:", tags);
  console.log("Current eventSetupForm.tags:", eventSetupForm.tags);
  console.log("Should show create tag inputs:", eventSetupForm.tags === "Other");

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
        inputRef={nameRef}
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
          inputRef={categoryRef}
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
          inputRef={tagsRef}
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
        id="eventSetupSeries"
        label="Series"
        value={eventSetupForm.seriesName || ""}
        setValue={(selectedSeriesName: string) => {
          const selectedSeries = series.find((seriesItem: any) => seriesItem.name === selectedSeriesName);
          setFormValue("Event Setup", "seriesName", selectedSeriesName);
          setFormValue("Event Setup", "seriesId", selectedSeries ? selectedSeries.id : null);
        }}
        placeholder={seriesLoading ? "Loading series..." : "Select Series"}
        classname="!w-full"
        showDropdown
        dropdownOptions={series.map((seriesItem: any) => seriesItem.name)}
        disabled={seriesLoading}
      />
          <DefaultInput
            id="eventSetupContactNumber"
            label="Organizer's Contact Number"
            value={eventSetupForm.contactNumber || ""}
            setValue={(value: string) => handleInputChange("contactNumber", value)}
            type="tel"
            placeholder="Enter contact number"
            classname="!w-full"
            required
            helperText={eventSetupErrors.contactNumber || ""}
            style={eventSetupErrors.contactNumber ? "border-red-500" : ""}
            inputRef={contactNumberRef}
          />
      <ImageUploadInput 
        value={eventSetupForm.coverImage || ""} 
        onChange={handleImage} 
      />
    </div>
  );
};

export default EventSetup;