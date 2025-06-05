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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags();
        const tagNames = response.map((tag: any) => tag.name);
        setTags([...tagNames, "Other"]);
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
    if (selectedTag === "Other") {
      setShowCreateTag(true);
      setFormValue("Event Setup", "tags", "");
    } else {
      setShowCreateTag(false);
      setFormValue("Event Setup", "tags", selectedTag);
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
        setValue={handleTagChange}
        placeholder={loading ? "Loading tags..." : "Select Tag"}
        classname="!w-full"
        showDropdown
        dropdownOptions={tags}
        disabled={loading}
      />
      
      {showCreateTag && (
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
