import { useNavigate } from 'react-router';
import DefaultButton from '../../components/buttons/DefaultButton';
import { useOnboardingStore } from '../../stores/onboardingStore';
// import { LuPencilLine } from "react-icons/lu";
// import { BiSolidCalendarStar } from "react-icons/bi";
import { FaPlus } from 'react-icons/fa6';
import { Modal } from '../../components/modal/Modal';
import { useEffect, useState } from 'react';
import createEvent from '../../assets/images/createEvent.svg';
import DefaultInput from '../../components/inputs/DefaultInput';
import { ImageUploadInput } from '../../components/inputs/ImageInput';
import { createSeries, getSeries } from '../../Containers/seriesApi';
import { Storage } from '../../stores/InAppStorage';
import { errorAlert } from '../../components/alerts/ToastService';
import SeriesCard from '../../components/cards/SeriesCard';
import { SeriesCardSkeleton } from '../../components/common/LoadingSkeleton';

const EventCreation = () => {
  const navigate = useNavigate();
  const { markStepComplete } = useOnboardingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateSeriesModalOpen, setIsCreateSeriesModalOpen] = useState(false);
  const [seriesNameOnboarding, setSeriesNameOnboarding] = useState('');
  const [descriptionOnboarding, setDescriptionOnboarding] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [seriesList, setSeriesList] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const user = Storage.getItem('user');
  const userId = user?.id;
  const handleNext = () => {
    try {
      setisLoading(true);
      // const res=await CreateSeries(confirmPassword,password)
      markStepComplete('pinSetup');
      setIsModalOpen(true);
      // navigate("/dashboard");
    } catch (error) {
      setisLoading(false);
    } finally {
      setisLoading(false);
    }
    markStepComplete('pinSetup');
    setIsModalOpen(true);
    //   navigate("/create-event-series");
  };
  const handleImage = (imageUrl: string) => {
    console.log('Uploaded image URL:', imageUrl);
    setCoverImage(imageUrl);
  };

  const handleCreateSeries = async () => {
    if (!seriesNameOnboarding.trim() || !descriptionOnboarding.trim()) {
      return;
    }

    try {
      if (!userId) {
        console.error('User ID not found');
        errorAlert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const response = await createSeries(
        seriesNameOnboarding,
        userId,
        descriptionOnboarding,
        coverImage ||
          'https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=2054&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      );

      console.log('Series created:', response);
      setIsCreateSeriesModalOpen(false);
      setSeriesNameOnboarding('');
      setDescriptionOnboarding('');
      setCoverImage('');
      markStepComplete('createEventSeries');
      setIsModalOpen(true);
      fetchSeries();
    } catch (error) {
      console.error('Error creating series:', error);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const fetchSeries = async () => {
    try {
      setSeriesLoading(true);
      const data = await getSeries();
      setSeriesList(data);
    } catch (err) {
      console.error('Error fetching series:', err);
    } finally {
      setSeriesLoading(false);
    }
  };
  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <div className="flex flex-col flex-grow  justify-between h-full">
      <div className="grid w-full md:mx-auto gap-[20px] h-fit">
        <div className=" grid text-center">
          <h1 className="text-[22px] md:text-[36px] font-bold">Create Event Series</h1>
          <p className="text-[14px] md:text-[18px] text-grey400">
            You can change this in your dashboard later
          </p>
        </div>
        <div className="flex gap-[20px] w-full md:w-fit md:m-auto md:gap-[40px]">
          {/* <div className="bg-white rounded-[15px] p-[20px] md:px-[40px] w-full md:w-[20vw] h-[180px]">
            <div className="flex justify-end">
              <LuPencilLine className="text-primary w-[20px] cursor-pointer" />
            </div>

            <div className="p-[10px] bg-[rgba(233,27,65,0.08)] rounded-[8px] w-fit mb-[30px]">
              <BiSolidCalendarStar className="text-primary w-[26px] h-[26px]" />
            </div>

            <p className="text-black text-[18px] font-medium">My Events</p>
          </div> */}
        </div>
        {/* Series Cards or Skeleton */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-[20px] md:gap-[40px] justify-center m-auto overflow-auto md:max-h-[40vh]">
          {/* Create New Series Card */}
          <div className="md:w-[20vw] w-[90vw]  md:h-[17.5rem]">
            <div
              className="bg-white rounded-[15px] p-[20px] flex flex-col items-center justify-center w-full text-center h-full border-2 border-dotted border-primary cursor-pointer hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
              onClick={() => setIsCreateSeriesModalOpen(true)}
            >
              <FaPlus className="text-primary text-[2rem] mb-2" />
              <p className="text-[18px] font-medium text-black">Create New Series</p>
            </div>
          </div>

          {/* Series List */}
          {seriesLoading ? (
            <SeriesCardSkeleton />
          ) : (
            seriesList.map((series: any) => (
              <div className="md:w-[20vw]" key={series.id}>
                <SeriesCard
                  title={series.name}
                  description={series.description}
                  imageUrl={series.image}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex gap-[20px] items-center mx-auto">
        <DefaultButton
          type="default"
          variant="tertiary"
          className="!w-full md:!w-fit md:!mx-auto"
          onClick={handleBack}
        >
          Back
        </DefaultButton>
        <DefaultButton
          type="default"
          variant="primary"
          className="!w-full md:!w-fit md:!mx-auto"
          onClick={handleNext}
          isLoading={isLoading}
        >
          Finish
        </DefaultButton>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="m-auto 4vw grid gap-[20px] text-center">
          <img src={createEvent} alt="" className="m-auto" />
          <h1 className="font-bold text-[#231F20] text-[36px]">All Set!</h1>
          <p className="text-lightGrey text-[16px]">
            You're all set to create and manage your dream event. Let’s get started!
          </p>
          <DefaultButton
            type="default"
            variant="primary"
            className="!w-full md:!w-fit md:!mx-auto"
            onClick={() => {
              // setIsModalOpen(false);
              navigate('/dashboard');
            }}
          >
            Explore
          </DefaultButton>
        </div>
      </Modal>

      <Modal
        isOpen={isCreateSeriesModalOpen}
        onClose={() => setIsCreateSeriesModalOpen(false)}
        key="create-series-modal"
      >
        <h1 className="text-[1.5rem] text-black font-medium text-center ">Create Series</h1>
        <div className="m-auto 4vw grid gap-[20px] w-full ">
          <DefaultInput
            label="Series Name"
            id="eventSeriesNameOnboarding"
            value={seriesNameOnboarding}
            setValue={setSeriesNameOnboarding}
            placeholder="e.g., Lagos Concerts 2025 or VIP Exclusive"
            classname="!w-full"
          />
          <DefaultInput
            label="Description"
            id="eventSeriesDescription"
            value={descriptionOnboarding}
            setValue={setDescriptionOnboarding}
            placeholder="e.g., Multi-location music tour with similar theme"
            classname="!w-full"
          />
          <ImageUploadInput
            onChange={handleImage}
            value={coverImage}
            setUploadingImage={setUploadingImage}
          />
          <div className="md:mx-auto grid md:flex gap-[20px] ">
            <DefaultButton
              type="default"
              variant="tertiary"
              className="!w-full md:!w-[9rem] md:!mx-auto border"
              onClick={() => {
                setIsCreateSeriesModalOpen(false);
              }}
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              type="default"
              variant="primary"
              className="!w-full md:!w-[9rem] md:!mx-auto"
              onClick={handleCreateSeries}
              isLoading={uploadingImage}
              disabled={!seriesNameOnboarding.trim() || !descriptionOnboarding.trim()}
            >
              Create Series
            </DefaultButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventCreation;
