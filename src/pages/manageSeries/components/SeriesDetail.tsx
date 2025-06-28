// import { FaPlus } from "react-icons/fa";
import { BsDot } from 'react-icons/bs';
import { BiEditAlt } from 'react-icons/bi';
import DefaultButton from '../../../components/buttons/DefaultButton';
import { CgLayoutGridSmall } from 'react-icons/cg';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Modal } from '../../../components/modal/Modal';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { getSeriesBySlug, updateSeries } from '../../../Containers/seriesApi';
import { getFallbackImage } from '../../../config/fallbackImages';

interface SeriesData {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  slug: string;
  isPublished: boolean;
  isVerified: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  events?: Array<{
    id: string;
    name: string;
    slug: string;
    bannerImage: string;
    startDate: string;
    endDate: string | null;
    startTime: string;
    endTime: string;
    status: string;
  }>;
}

const SeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventName, seteventName] = useState('');
  const [seriesData, setSeriesData] = useState<SeriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get ID from navigate state
  const seriesId = location.state?.id;

  // Edit mode states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const events = seriesData?.events || [];

  useEffect(() => {
    const fetchSeriesData = async () => {
      if (!seriesId) {
        setError('Series ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getSeriesBySlug(slug as string);
        setSeriesData(response);
        setEditedName(response.name);
        setEditedDescription(response.description);
        setError(null);
      } catch (err) {
        console.error('Error fetching series data:', err);
        setError('Failed to fetch series data');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSaveChanges = async () => {
    if (!seriesData || !seriesId) return;

    // Store original values in case we need to revert
    const originalName = seriesData.name;
    const originalDescription = seriesData.description;

    try {
      setIsSaving(true);

      await updateSeries(seriesId, editedName, editedDescription, seriesData.coverImage);

      // Success: Update local state with new values
      setSeriesData((prev) =>
        prev
          ? {
              ...prev,
              name: editedName,
              description: editedDescription,
            }
          : null,
      );

      // Exit edit modes
      setIsEditingName(false);
      setIsEditingDescription(false);

      console.log('Series updated successfully');
    } catch (error) {
      console.error('Error updating series:', error);

      // Error: Revert to original values
      setEditedName(originalName);
      setEditedDescription(originalDescription);

      // Exit edit modes
      setIsEditingName(false);
      setIsEditingDescription(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(seriesData?.name || '');
    setEditedDescription(seriesData?.description || '');
    setIsEditingName(false);
    setIsEditingDescription(false);
  };

  const isInEditMode = isEditingName || isEditingDescription;

  if (loading) {
    return (
      <div className="md:bg-white md:rounded-md min-h-[80vh] w-full block md:grid mt-[.6rem] md:p-[25px] md:grid-cols-[2fr_3fr] gap-[20px] animate-pulse">
        <div className="rounded-md md:bg-gray-100 md:p-[20px] h-fit md:h-full">
          <div className="rounded-[8px] bg-gray-200 w-full h-[18rem]"></div>
          <div className="py-[20px] border-b border-[#E1E1E1]">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="py-[20px]">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        <div className="grid gap-[20px] h-fit">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="grid gap-[20px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-[20px] items-center py-[20px] border-b border-[#E1E1E1]"
              >
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="rounded-md h-[5.9rem] w-[9.6rem] bg-gray-200"></div>
                <div className="grid gap-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !seriesData) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-red-500">{error || 'Series not found'}</div>
      </div>
    );
  }

  return (
    <div className="md:bg-white md:rounded-md min-h-[80vh] w-full block md:grid mt-[.6rem] md:p-[25px] md:grid-cols-[2fr_3fr] gap-[20px]">
      <div className="rounded-md md:bg-[#F8F9F9] md:p-[20px] h-fit md:h-full ">
        {isInEditMode && (
          <div className="grid grid-cols-2 gap-3 mb-[20px]">
            <DefaultButton
              type="default"
              variant="tertiary"
              className="!w-full border"
              onClick={handleCancelEdit}
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              type="default"
              variant="primary"
              className="!w-full"
              onClick={handleSaveChanges}
              isLoading={isSaving}
            >
              Save Changes
            </DefaultButton>
          </div>
        )}
        <div className="rounded-[8px] bg-grey w-full h-[18rem] overflow-hidden">
          <img
            src={seriesData.coverImage}
            alt={seriesData.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-start gap-[20px] py-[20px] border-b border-[#E1E1E1]">
          <div className="grid flex-1">
            {isEditingName ? (
              <DefaultInput
                id="editSeriesName"
                value={editedName}
                setValue={setEditedName}
                placeholder="Series name"
                classname="!w-full !mb-2"
                label="Series Name"
              />
            ) : (
              <h1 className="text-black font-bold text-[1.2rem]">{seriesData.name}</h1>
            )}
            <p className="text-lightGrey font-medium text-[.875rem] flex items-center">
              {seriesData.isPublished ? 'Published' : 'Draft'}
              <span className="text-[2rem]">
                <BsDot />
              </span>
              Updated {formatDate(seriesData.updatedAt)}
            </p>
          </div>
          <button
            className="text-[1.2rem] cursor-pointer"
            aria-labelledby="Edit"
            onClick={() => setIsEditingName(true)}
          >
            <BiEditAlt />
          </button>
        </div>
        <div className="flex justify-between items-start gap-[20px] py-[20px] ">
          <div className="grid flex-1">
            <h1 className="text-lightGrey text-[.875rem]">Description:</h1>
            {isEditingDescription ? (
              <DefaultInput
                id="editSeriesDescription"
                value={editedDescription}
                setValue={setEditedDescription}
                placeholder="Series description"
                classname="!w-full !mt-2"
                label="Series Description"
              />
            ) : (
              <p className="text-black font-medium text-[.9rem] flex items-center">
                {seriesData.description}
              </p>
            )}
          </div>
          <button
            className="text-[1.2rem] cursor-pointer"
            aria-labelledby="Edit"
            onClick={() => setIsEditingDescription(true)}
          >
            <BiEditAlt />
          </button>
        </div>
      </div>
      <div className="grid gap-[20px] h-fit ">
        <div className="flex justify-between items-center">
          <h1 className="text-black font-medium text-[1.2rem]">Event List</h1>
          {/* <DefaultButton
                        type="icon-left"
                        className="!w-fit"
                        icon={<FaPlus className="text-[.8rem] text-white" />}
                        variant="primary"
                        onClick={() => {
                            console.log("Navigating to create event with series ID:", seriesId);
                            navigate('/dashboard/create-event',{state: {seriesId: seriesId}});
                        }}
                    >
                        Add Events to Series
                    </DefaultButton> */}
        </div>
        <div className="grid gap-[20px] md:max-h-[70vh] md:overflow-y-auto ">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-[20px] items-center py-[20px] border-b border-[#E1E1E1]"
              >
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="rounded-md h-[5.9rem] w-[9.6rem] bg-gray-200 animate-pulse"></div>
                <div className="grid gap-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="flex gap-[20px] items-center py-[20px] border-b border-[#E1E1E1] cursor-pointer"
                onClick={() =>
                  navigate(`/manage-events/${event.slug}`, { state: { id: event.id } })
                }
              >
                <CgLayoutGridSmall className="text-black text-[2rem]" />
                <div className="rounded-md h-[5.9rem] w-[9.6rem] bg-almostBlack overflow-hidden">
                  <img
                    src={event.bannerImage ?? getFallbackImage('default')}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid gap-2 flex-1">
                  <p className="text-black text-[1rem] font-medium">{event.name}</p>
                  <p className="text-lightGrey text-[.8rem]">
                    {formatDate(event.startDate)} • {event.startTime} - {event.endTime}
                  </p>
                  <span
                    className={`text-[.75rem] px-2 py-1 rounded-full w-fit ${
                      event.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lightGrey py-8">No events found in this series</div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-[1.5rem] text-black font-medium text-center ">Add Event</h1>
        <DefaultInput
          id="eventName"
          value={eventName}
          label="Event Name"
          setValue={seteventName}
          placeholder="Search Event"
          classname="!w-full"
        />
        <div className="md:mx-auto  grid md:flex  w-full  mt-[20px]">
          <DefaultButton
            type="default"
            variant="tertiary"
            className="!w-full md:!w-[9rem] md:!mx-auto border"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-[9rem] md:!mx-auto"
            onClick={() => {
              // setIsModalOpen(false);
            }}
          >
            Create
          </DefaultButton>
        </div>
      </Modal>
    </div>
  );
};

export default SeriesDetail;
