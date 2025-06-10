import { useState, useEffect, useMemo, useRef } from "react";
import DefaultInput from "../../components/inputs/DefaultInput";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { ImageUploadInput } from "../../components/inputs/ImageInput";
import { useEventStore } from "../../stores/useEventStore";
import { getTags, createTag } from "../../Containers/eventApi";
import type { Options } from "easymde";
import { getSeries } from "../../Containers/seriesApi";
import { useLocation } from "react-router-dom";

const EventSetup = () => {
  const { form, setFormValue, errors } = useEventStore();
  const eventSetupForm = form["Event Setup"] || {};
  const eventSetupErrors = errors["Event Setup"] || {};
  const [tags, setTags] = useState<any[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [series, setSeries] = useState<any[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
	const location = useLocation();
  const [selectedSeriesName, setSelectedSeriesName] = useState<string>("");

  const nameRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const contactNumberRef = useRef<any>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setSeriesLoading(true);
        const response = await getSeries();
        setSeries(response || []);

        // If there's a prefilled series ID, find and set the corresponding name
        if (eventSetupForm.seriesId && response && response.length > 0) {
          const matchedSeries = response.find((seriesItem: any) => seriesItem.id === eventSetupForm.seriesId);
          if (matchedSeries) {
            setFormValue("Event Setup", "seriesName", matchedSeries.name);
						setSelectedSeriesName(matchedSeries.name);
          }
        }
      } catch (error) {
        console.error("Error fetching series:", error);
        setSeries([]);
      } finally {
        setSeriesLoading(false);
      }
    };

		// Check for seriesId from navigation state
		const seriesIdFromNavigation = location.state?.seriesId;
		if (seriesIdFromNavigation) {
			setFormValue("Event Setup", "seriesId", seriesIdFromNavigation);
		}

    fetchSeries();
  }, [eventSetupForm.seriesId, location.state?.seriesId, setFormValue, location]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags();
        if (response && response.length > 0) {
          setTags(response); // Store full tag objects
          const tagNames = response.map((tag: any) => tag.name);
          setTagOptions([...tagNames, "Other"]); // Display names in dropdown

          // If there's a prefilled tag ID, find and set the corresponding name
          if (eventSetupForm.tags && eventSetupForm.tags !== "Other") {
            const matchedTag = response.find((tag: any) => tag.id === eventSetupForm.tags);
            if (matchedTag) {
              setFormValue("Event Setup", "selectedTagName", matchedTag.name);
            }
          }
        } else {
          setTags([]);
          setTagOptions(["Other"]);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
        setTagOptions(["Other"]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [eventSetupForm.tags]);

  const handleImage = (imageUrl: string) => {
    console.log("Uploaded image URL:", imageUrl);
    setFormValue("Event Setup", "coverImage", imageUrl);
  };

  const handleTagChange = (selectedTagName: string) => {
    console.log("Selected tag name:", selectedTagName);

    if (selectedTagName === "Other") {
      setFormValue("Event Setup", "tags", "Other");
      setFormValue("Event Setup", "selectedTagName", selectedTagName);
      setShowCreateTag(true);
    } else {
      // Find the tag object by name and store its ID
      const selectedTag = tags.find((tag: any) => tag.name === selectedTagName);
      if (selectedTag) {
        setFormValue("Event Setup", "tags", selectedTag.id); // Store tag ID
        setFormValue("Event Setup", "selectedTagName", selectedTagName); // Store name for display
      }
      setShowCreateTag(false);
      // Reset the new tag fields when not selecting "Other"
      setNewTagName("");
      setNewTagDescription("");
    }
    console.log("Updated eventSetupForm.tags:", eventSetupForm.tags);
  };

  // const handleCreateTag = async () => {
  //   if (!newTagName.trim()) return;

  //   try {
  //     setIsCreatingTag(true);
  //     await createTag(newTagName, newTagDescription || "");

  //     // Add the new tag to the tags array and select it
  //     const updatedTags = [...tags.filter(tag => tag !== "Other"), newTagName, "Other"];
  //     setTags(updatedTags);
  //     setFormValue("Event Setup", "tags", newTagName);

  //     // Reset form and hide create tag section
  //     setNewTagName("");
  //     setNewTagDescription("");
  //     setShowCreateTag(false);
  //   } catch (error) {
  //     console.error("Error creating tag:", error);
  //   } finally {
  //     setIsCreatingTag(false);
  //   }
  // };
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
  };

  const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(eventSetupErrors).length > 0) {
      setTimeout(() => {
        if (eventSetupErrors.name && nameRef.current) {
          nameRef.current.focus();
        } else if (eventSetupErrors.category && categoryRef.current) {
          categoryRef.current.focus();
        } else if (eventSetupErrors.tags && tagsRef.current) {
          tagsRef.current.focus();
        } else if (eventSetupErrors.contactNumber && contactNumberRef.current) {
          contactNumberRef.current.focus();
        }
      }, 100);
    }

    return Object.keys(eventSetupErrors).length === 0;
  };

  // Export validation function for external use
  useEffect(() => {
    (window as any).validateEventSetup = validateForm;
    return () => {
      delete (window as any).validateEventSetup;
    };
  }, [eventSetupForm]);


  console.log("EventSetup form data:", eventSetupForm);
  console.log("Current tag options:", tagOptions);
  console.log("Full tags data:", tags);
  console.log("Selected tag ID:", eventSetupForm.tags);
  console.log("Selected tag name:", eventSetupForm.selectedTagName);
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
          placeholder="Select Category"
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
          value={eventSetupForm.selectedTagName || ""}
          setValue={handleTagChange}
          placeholder={loading ? "Loading tags..." : "Select Tag"}
          classname="!w-full"
          showDropdown
          dropdownOptions={tagOptions}
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
            // value={newTagName}
            // setValue={setNewTagName}
            value={eventSetupForm.newTagName || ""}
          setValue={(value: string) => handleInputChange("newTagName", value)}
            placeholder="Enter new tag name"
            classname="!w-full"
            // onKeyDown={(e:any) => {
            //   if (e.key === 'Enter' && newTagName.trim()) {

            //     handleCreateTag();
            //   }
            // }}
          />
          <DefaultInput
            id="newTagDescription"
            label="Tag Description (Optional)"
            value={eventSetupForm.newTagDescription || ""}
          setValue={(value: string) => handleInputChange("newTagDescription", value)}
            // value={newTagDescription}
            // setValue={setNewTagDescription}
            placeholder="Enter tag description"
            classname="!w-full"
          />
        </>
      )}
			{eventSetupForm.seriesId ? (
				// Show selected series statement when series ID exists
				<>
					<label htmlFor="eventSetupSeries">
						<p className="text-black ">Series</p>
					</label>
					<div>
						{selectedSeriesName ? (
							<p>Selected Series: {selectedSeriesName}</p>
						) : (
							<p>Loading series name...</p>
						)}
					</div>
				</>
			) : (
				<DefaultInput
					id="eventSetupSeries"
					label="Series"
					value={eventSetupForm.seriesName || ""}
					setValue={(selectedSeriesName: string) => {
						const selectedSeries = series.find((seriesItem: any) => seriesItem.name === selectedSeriesName);
						setFormValue("Event Setup", "seriesName", selectedSeriesName);
						setFormValue("Event Setup", "seriesId", selectedSeries ? selectedSeries.id : null);
						setSelectedSeriesName(selectedSeriesName);
					}}
					placeholder={seriesLoading ? "Loading series..." : "Select Series"}
					classname="!w-full"
					showDropdown
					dropdownOptions={series.map((seriesItem: any) => seriesItem.name)}
					disabled={seriesLoading}
				/>
			)}
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