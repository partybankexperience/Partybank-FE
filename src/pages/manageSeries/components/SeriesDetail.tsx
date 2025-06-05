
import { FaPlus } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import DefaultButton from "../../../components/buttons/DefaultButton";
import { CgLayoutGridSmall } from "react-icons/cg";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "../../../components/modal/Modal";
import DefaultInput from "../../../components/inputs/DefaultInput";
import { getSeriesById } from "../../../Containers/seriesApi";

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
}

const SeriesDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventName, seteventName] = useState('');
    const [seriesData, setSeriesData] = useState<SeriesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mockEvents = [
        {
          id: 1,
          name: "Canvas and Beats",
          description: "Canvas & Beats is an innovative event that seamlessly blends.",
          imageUrl: "",
        },
        {
          id: 2,
          name: "Tech Flow Summit",
          description: "A forward-thinking event exploring AI and emerging tech trends.",
          imageUrl: "",
        },
        {
          id: 3,
          name: "Green Earth Expo",
          description: "An eco-friendly event promoting sustainability and innovation.",
          imageUrl: "",
        },
    ];

    useEffect(() => {
        const fetchSeriesData = async () => {
            if (!id) {
                setError("Series ID not found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getSeriesById(id);
                setSeriesData(response);
                setError(null);
            } catch (err) {
                console.error("Error fetching series data:", err);
                setError("Failed to fetch series data");
            } finally {
                setLoading(false);
            }
        };

        fetchSeriesData();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-lightGrey">Loading series data...</div>
            </div>
        );
    }

    if (error || !seriesData) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-red-500">{error || "Series not found"}</div>
            </div>
        );
    }

    return (
        <div className="md:bg-white md:rounded-md h-[80vh] w-full block md:grid mt-[.6rem] md:p-[25px] md:grid-cols-[2fr_3fr] gap-[20px]">
            <div className="rounded-md md:bg-[#F8F9F9] md:p-[20px] h-fit md:h-full ">
                <div className="rounded-[8px] bg-grey w-full h-[18rem] overflow-hidden">
                    <img 
                        src={seriesData.coverImage} 
                        alt={seriesData.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex justify-between items-start gap-[20px] py-[20px] border-b border-[#E1E1E1]">
                    <div className="grid ">
                        <h1 className="text-black font-bold text-[1.2rem]">
                            {seriesData.name}
                        </h1>
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
                    >
                        <BiEditAlt />
                    </button>
                </div>
                <div className="flex justify-between items-start gap-[20px] py-[20px] ">
                    <div className="grid ">
                        <h1 className="text-lightGrey text-[.875rem]">Description:</h1>
                        <p className="text-black font-medium text-[.9rem] flex items-center">
                            {seriesData.description}
                        </p>
                    </div>
                    <button
                        className="text-[1.2rem] cursor-pointer"
                        aria-labelledby="Edit"
                    >
                        <BiEditAlt />
                    </button>
                </div>
            </div>
            <div className="grid gap-[20px] h-fit ">
                <div className="flex justify-between items-center">
                    <h1 className="text-black font-medium text-[1.2rem]">Event List</h1>
                    <DefaultButton
                        type="icon-left"
                        className="!w-fit"
                        icon={<FaPlus className="text-[.8rem] text-white" />}
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Event
                    </DefaultButton>
                </div>
                <div className="grid gap-[20px]">
                    {mockEvents.map((event) => (
                        <div key={event.id} className="flex gap-[20px] items-center py-[20px] border-b border-[#E1E1E1]">
                            <CgLayoutGridSmall className="text-black text-[2rem]" />
                            <div className="rounded-md h-[5.9rem] w-[9.6rem] bg-almostBlack"></div>
                            <div className="grid gap-2">
                                <p className="text-black text-[1rem]">{event.name}</p>
                                <p className="text-lightGrey text-[.8rem]">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <h1 className="text-[1.5rem] text-black font-medium text-center ">
                    Add Event
                </h1>
                <DefaultInput 
                    id='eventName' 
                    value={eventName} 
                    label='Event Name' 
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
