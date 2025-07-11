import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { createSeries } from '../../../Containers/seriesApi';
import { Storage } from '../../../stores/InAppStorage';
import { Modal } from '../../../components/modal/Modal';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { ImageUploadInput } from '../../../components/inputs/ImageInput';
import DefaultButton from '../../../components/buttons/DefaultButton';

interface CreateNewSeriesProps {
  onSeriesCreated?: (newSeries: any) => void;
}

const CreateNewSeries = ({ onSeriesCreated }: CreateNewSeriesProps) => {
  const [seriesName, setSeriesName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    console.log('CreateNewSeries mounted');
  }, []);

  const resetForm = () => {
    setSeriesName('');
    setDescription('');
    setCoverImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!seriesName.trim() || !description.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const user = Storage.getItem('user');
      const userId = user?.id;

      if (!userId) {
        console.error('User ID not found');
        setIsLoading(false);
        return;
      }

      const response = await createSeries(
        seriesName,
        userId,
        description,
        coverImage ||
          'https://res.cloudinary.com/dp1zblmv4/image/upload/v1751075414/partybank/jyvemoyskt5dnhatk9zw.png',
      );

      console.log('Series created:', response);

      // Call the callback function to update parent component
      if (onSeriesCreated) {
        onSeriesCreated(response.data);
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating series:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="bg-[#FFF2F4] rounded-[10px] px-[20px] min-w-[180px] w-full min-h-fit h-[157px] md:h-[17.5rem] grid justify-center items-center cursor-pointer hover:shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
        role="button"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="grid gap-[20px] text-center py-[20px]">
          <div className="bg-white rounded-[6px] p-[14px] h-fit w-fit m-auto">
            <FaPlus className="text-[32px] text-primary" />
          </div>
          <div className="grid gap-[8px] text-center">
            <p className="text-black font-medium text-[1.125rem]">Create New Series</p>
            <p className="text-lightGrey font-medium text-[.875rem]">
              Create a series to keep your events put together
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="m-auto 4vw grid gap-[20px] w-full">
          <DefaultInput
            label="Series Name"
            id="createSeriesName"
            value={seriesName}
            setValue={setSeriesName}
            placeholder="e.g., Lagos Concerts 2025 or VIP Exclusive"
            classname="!w-full"
          />
          <DefaultInput
            label="Description"
            id="createSeriesDescription"
            value={description}
            setValue={setDescription}
            placeholder="e.g., Multi-location music tour with similar theme"
            classname="!w-full"
          />
          <ImageUploadInput label="Cover Image" value={coverImage} onChange={setCoverImage} />
          <div className="md:mx-auto grid md:flex gap-[20px] ">
            <DefaultButton
              type="default"
              variant="tertiary"
              className="!w-full md:!w-[9rem] md:!mx-auto border"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              submitType="submit"
              variant="primary"
              className="!w-full md:!w-[9rem] md:!mx-auto"
              isLoading={isLoading}
            >
              Create Series
            </DefaultButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateNewSeries;
