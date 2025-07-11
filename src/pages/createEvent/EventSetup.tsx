import { useState, useEffect, useMemo, useRef } from 'react';
import DefaultInput from '../../components/inputs/DefaultInput';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { ImageUploadInput } from '../../components/inputs/ImageInput';
import { useEventStore } from '../../stores/useEventStore';
import {
  getTags,
  // createTag,
  checkSimilarEvent,
} from '../../Containers/eventApi';
import type { Options } from 'easymde';
import { getSeries } from '../../Containers/seriesApi';
import { useLocation } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const EventSetup = () => {
  const { form, setFormValue, errors, clearError } = useEventStore();
  const eventSetupForm = form['Event Setup'] || {};
  const eventSetupErrors = errors['Event Setup'] || {};
  const [tags, setTags] = useState<any[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  const [series, setSeries] = useState<any[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  // const [selectedSeriesName, setSelectedSeriesName] = useState<string>("");
  const [checkingSimilarEvents, setCheckingSimilarEvents] = useState(false);
  const [similarEvents, setSimilarEvents] = useState<any[]>([]);
  const [showSimilarEventsMessage, setShowSimilarEventsMessage] = useState(false);

  const nameRef = useRef<any>(null);
  const categoryRef = useRef<any>(null);
  const tagsRef = useRef<any>(null);
  const contactNumberRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setSeriesLoading(true);
        const response = await getSeries();
        setSeries(response || []);

        // If there's a prefilled series ID, find and set the corresponding name
        if (eventSetupForm.seriesId && response && response.length > 0) {
          console.log('Looking for series with ID:', eventSetupForm.seriesId);
          const matchedSeries = response.find(
            (seriesItem: any) => seriesItem.id === eventSetupForm.seriesId,
          );
          console.log('Matched series:', matchedSeries);
          if (matchedSeries) {
            setFormValue('Event Setup', 'seriesName', matchedSeries.name);
            console.log('Set series name to:', matchedSeries.name);
          }
        }
      } catch (error) {
        console.error('Error fetching series:', error);
        setSeries([]);
      } finally {
        setSeriesLoading(false);
      }
    };

    // Check for seriesId from navigation state
    const seriesIdFromNavigation = location.state?.seriesId;

    if (seriesIdFromNavigation) {
      console.log('Setting series ID from navigation:', seriesIdFromNavigation);
      setFormValue('Event Setup', 'seriesId', seriesIdFromNavigation);
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
          setTagOptions([...tagNames]); // Display names in dropdown

          // If there's a prefilled tag ID, find and set the corresponding name
          if (eventSetupForm.tags) {
            const matchedTag = response.find((tag: any) => tag.id === eventSetupForm.tags);
            if (matchedTag) {
              setFormValue('Event Setup', 'selectedTagName', matchedTag.name);
            }
          }
        } else {
          setTags([]);
          setTagOptions(['Other']);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        setTags([]);
        setTagOptions(['Other']);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [eventSetupForm.tags]);

  const handleImage = (imageUrl: string) => {
    console.log('Uploaded image URL:', imageUrl);
    setFormValue('Event Setup', 'coverImage', imageUrl);
  };

  const handleTagChange = (selectedTagName: string) => {
    console.log('Selected tag name:', selectedTagName);
    // Find the tag object by name and store its ID
    const selectedTag = tags.find((tag: any) => tag.name === selectedTagName);
    if (selectedTag) {
      setFormValue('Event Setup', 'tags', selectedTag.id); // Store tag ID
      setFormValue('Event Setup', 'selectedTagName', selectedTagName); // Store name for display
      if (eventSetupErrors['tags']) {
        clearError('Event Setup', 'tags');
      }
    }

    console.log('Updated eventSetupForm.tags:', eventSetupForm.tags);
  };

  const options: Options = useMemo(
    () => ({
      placeholder: 'Type here...',
      spellChecker: false,
      toolbar: [
        'bold',
        'italic',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'preview',
      ] as const, // 👈 Important for satisfying the `readonly` type
    }),
    [],
  );

  const handleInputChange = (key: string, value: string) => {
    setFormValue('Event Setup', key, value);
    // Clear field error when typing
    if (eventSetupErrors[key]) {
      clearError('Event Setup', key);
    }

    // Reset similar events when name changes
    if (key === 'name') {
      setSimilarEvents([]);
      setShowSimilarEventsMessage(false);
    }
  };

  const handleNameBlur = async () => {
    console.log('handleNameBlur called');
    const eventName = eventSetupForm.name?.trim();
    console.log('Event name:', eventName);

    if (!eventName || eventName.length < 3) {
      console.log('Event name too short or empty, skipping API call');
      setSimilarEvents([]);
      setShowSimilarEventsMessage(false);
      return;
    }

    try {
      console.log('Starting similar event check...');
      setCheckingSimilarEvents(true);
      // Use current date as default for the API call
      const currentDate = new Date().toISOString().split('T')[0];
      console.log('Calling checkSimilarEvent API with:', eventName, currentDate);
      const response = await checkSimilarEvent(eventName, currentDate);
      console.log('Similar event API response:', response);

      if (response && response.similarEventExists) {
        setSimilarEvents(response.similarEvents || []);
        setShowSimilarEventsMessage(true);
        console.log('Similar events found:', response.similarEvents);
      } else {
        setSimilarEvents([]);
        setShowSimilarEventsMessage(false);
        console.log('No similar events found');
      }
    } catch (error) {
      console.error('Error checking similar events:', error);
      setSimilarEvents([]);
      setShowSimilarEventsMessage(false);
    } finally {
      setCheckingSimilarEvents(false);
    }
  };

  const validateForm = () => {
    // Focus on first error from store
    if (Object.keys(eventSetupErrors).length > 0) {
      setTimeout(() => {
        if (eventSetupErrors.name && nameRef.current) {
          nameRef.current.focus();
        } else if (eventSetupErrors.description && descriptionRef.current) {
          descriptionRef.current.focus();
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

  return (
    <div className="grid gap-[20px]">
      <div className="grid gap-1">
        <DefaultInput
          id="name"
          label="Event Name"
          value={eventSetupForm.name || ''}
          setValue={(value: string) => {
            handleInputChange('name', value);
          }}
          onBlur={() => {
            handleNameBlur();
          }}
          placeholder="Enter event name"
          required
          style={eventSetupErrors.name && 'border-red-500'}
          classname="!w-full"
          ref={nameRef}
          externalErrorMessage={eventSetupErrors.name || null}
          rightContent={
            checkingSimilarEvents ? (
              <FiLoader className="animate-spin text-gray-400" size={16} />
            ) : null
          }
        />

        {showSimilarEventsMessage && similarEvents.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Similar events found</h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    We found {similarEvents.length} similar event
                    {similarEvents.length !== 1 ? 's' : ''}:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {similarEvents.map((event, index) => (
                      <li key={index} className="truncate">
                        {event.name || event}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs">
                    Consider using a different name to avoid confusion with existing events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid">
        <label htmlFor="description">
          <p className="text-black ">Event Descriptions</p>
        </label>
        <SimpleMDE
          // value={description}
          // onChange={(value) => setDescription(value)}
          value={eventSetupForm.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          options={options}
          id="description"
          ref={descriptionRef}
        />
        {eventSetupErrors.description && (
          <p className="text-red-500 text-[14px]">{eventSetupErrors.description}</p>
        )}
      </div>

      <DefaultInput
        id="Category"
        label="Category"
        placeholder="Select Category"
        classname="!w-full"
        showDropdown
        dropdownOptions={['festival', 'concert']}
        value={eventSetupForm.category || ''}
        setValue={(value: string) => handleInputChange('category', value)}
        required
        externalErrorMessage={eventSetupErrors.category || null}
        style={eventSetupErrors.category && 'border-red-500'}
        ref={categoryRef}
      />
      <DefaultInput
        id="Tags"
        label="Tags"
        value={eventSetupForm.selectedTagName || ''}
        setValue={handleTagChange}
        placeholder={loading ? 'Loading tags...' : 'Select Tag'}
        classname="!w-full"
        showDropdown
        dropdownOptions={tagOptions}
        disabled={loading}
        required
        externalErrorMessage={eventSetupErrors.tags || null}
        style={eventSetupErrors.tags && 'border-red-500'}
        ref={tagsRef}
      />

      {eventSetupForm.tags === 'Other' && (
        <>
          <DefaultInput
            id="newTagName"
            label="Create New Tag"
            // value={newTagName}
            // setValue={setNewTagName}
            value={eventSetupForm.newTagName || ''}
            setValue={(value: string) => handleInputChange('newTagName', value)}
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
            value={eventSetupForm.newTagDescription || ''}
            setValue={(value: string) => handleInputChange('newTagDescription', value)}
            // value={newTagDescription}
            // setValue={setNewTagDescription}
            placeholder="Enter tag description"
            classname="!w-full"
          />
        </>
      )}

      <DefaultInput
        id="eventSetupSeries"
        label="Series"
        value={eventSetupForm.seriesName || ''}
        setValue={(selectedSeriesName: string) => {
          const selectedSeries = series.find(
            (seriesItem: any) => seriesItem.name === selectedSeriesName,
          );
          setFormValue('Event Setup', 'seriesName', selectedSeriesName);
          setFormValue('Event Setup', 'seriesId', selectedSeries ? selectedSeries.id : null);
          // setSelectedSeriesName(selectedSeriesName);
        }}
        placeholder={seriesLoading ? 'Loading series...' : 'Select Series'}
        classname="!w-full"
        showDropdown
        dropdownOptions={series.map((seriesItem: any) => seriesItem.name)}
        disabled={seriesLoading}
      />
      <DefaultInput
        id="eventSetupContactNumber"
        label="Organizer's Contact Number"
        value={eventSetupForm.contactNumber || ''}
        setValue={(value: string) => handleInputChange('contactNumber', value)}
        type="tel"
        placeholder="Enter contact number"
        classname="!w-full"
        required
        ref={contactNumberRef}
        externalErrorMessage={eventSetupErrors.contactNumber}
        style={eventSetupErrors.contactNumber && 'border-red-500'}
      />
      <ImageUploadInput value={eventSetupForm.coverImage || ''} onChange={handleImage} />
    </div>
  );
};

export default EventSetup;
