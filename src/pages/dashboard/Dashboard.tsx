import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from './components/Card';
import { BsPeopleFill } from 'react-icons/bs';
import Sales from './components/Sales';
import Graph from './components/Graph';
import { useState, useEffect } from 'react';
import Dropdown from '../../components/inputs/Dropdown';
// import avatar from "../../assets/images/avatar.png";
import EventCard from '../../components/cards/EventCard';
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { BiSolidCalendarStar } from 'react-icons/bi';
import { RiPuzzle2Fill } from 'react-icons/ri';
import { getEvents } from '../../Containers/eventApi';
import { EventCardSkeleton } from '../../components/common/LoadingSkeleton';
import { getDashboardOverview } from '../../Containers/dashboardApi';
import { FaNairaSign } from 'react-icons/fa6';

interface Sale {
  image: string;
  name: string;
  price: string;
  event: string;
}

interface Overview {
  totalEvents: number;
  totalBuyers: number;
  totalTicketsPurchased: number;
  totalSalesAfterDeductions: number;
}

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('Yearly');
  const [selectedSaleOption, setSelectedSaleOption] = useState('Sales');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOverview = async () => {
    try {
      const data = await getDashboardOverview();
      setOverview(data);
    } catch (err) {
      console.error('Overview fetch error:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      // Get only the first 4 events
      setEvents(response?.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchEvents();
  }, []);

  const fallbackImage =
    'https://plus.unsplash.com/premium_vector-1744201400607-99dddccd0180?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const sales: Sale[] = [
    // {
    //   image: "",
    //   name: "Brooklyn Simmons",
    //   price: "10,000",
    //   event: "Canvas and Beats",
    // },
    // {
    //   image: "",
    //   name: "Jane Cooper",
    //   price: "1,00,000",
    //   event: "Temple of Eros",
    // },
    // {
    //   image: "",
    //   name: "Cameron Williamson",
    //   price: "10,00,000",
    //   event: "Gen-Z House Backyard Party",
    // },
    // {
    //   image: "",
    //   name: "Robert Fox",
    //   price: "1,50,000",
    //   event: "The Outlaws Evolution",
    // },
    // {
    //   image: "",
    //   name: "Jacob Jones",
    //   price: "1,25,000",
    //   event: "Temple of Eros",
    // },
    // {
    //   image: "",
    //   name: "Annette Black",
    //   price: "2,00,000",
    //   event: "Chill With Dummzy: The Classroom",
    // },
  ];
  return (
    <DashboardLayout>
      <div className="grid gap-[30px] h-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px] h-fit">
          <Card
            title={overview?.totalBuyers.toString() || '0'}
            text="Total Buyers"
            icon={<BsPeopleFill className="text-[1.2rem] text-primary" />}
          />
          <Card
            title={overview?.totalTicketsPurchased.toString() || '0'}
            text="Total Ticket Purchase"
            icon={<RiPuzzle2Fill className="text-[1.2rem] text-primary" />}
          />
          <Card
            title={overview?.totalEvents.toString() || '0'}
            text="Total Events"
            icon={<BiSolidCalendarStar className="text-[1.2rem] text-primary" />}
          />
          <Card
            title={overview ? `₦${overview.totalSalesAfterDeductions.toLocaleString()}` : '₦0'}
            text="Total Sales"
            icon={<FaNairaSign className="text-[1.2rem] text-primary" />}
          />
        </div>

        <div className="grid lg:grid-cols-[2.5fr_1fr] gap-8">
          <section className="bg-white rounded-[15px] p-6" aria-label="Sales">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black" id="Sales">
                Sales Revenue
              </h2>
              <div className="flex items-center gap-3">
                <Dropdown
                  options={['Option 1', 'Option 2', 'Option 3']}
                  selected={selectedSaleOption}
                  onSelect={setSelectedSaleOption}
                  className="text-[12px]"
                />
                <Dropdown
                  options={['Option 1', 'Option 2', 'Option 3']}
                  selected={selectedOption}
                  onSelect={setSelectedOption}
                  className="text-[12px]"
                />
              </div>
            </div>
            <Graph />
          </section>

          <section
            aria-label="recentSales"
            className="bg-white rounded-[15px] p-6 md:min-w-[400px] h-fit"
          >
            <h2 className="text-lg font-semibold text-black mb-4" id="recentSales">
              Recent Sales
            </h2>
            <div className="grid gap-3 h-[300px] overflow-y-auto">
              {sales.length > 0 ? (
                sales.map((sale, idx) => (
                  <Sales
                    key={idx}
                    image={sale.image || fallbackImage}
                    name={sale.name}
                    price={sale.price}
                    event={sale.event}
                    className="text-sm"
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h3 className="text-md font-medium text-gray-800">No Recent Sales</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    No sales yet! Your recent transactions will appear here once you start selling.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section aria-label="myEvents" className="min-h-[30vh] bg-white rounded-md p-[1vw]">
          <div className="flex justify-between">
            <h2 id="myEvents" className="text-[22px] text-black font-medium">
              My Events
            </h2>
            <button
              className="text-primary text-[16px] cursor-pointer hover:text-deepRed flex gap-[12.5px] items-center"
              onClick={() => navigate('/manageEvents')}
            >
              See all Events <IoIosArrowForward />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] mt-[19px]">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <EventCardSkeleton key={index} />)
            ) : events.length > 0 ? (
              events.map((event, index) => (
                <EventCard
                  key={event.id || index}
                  name={event.name}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  startDate={event.startDate}
                  location={event.location}
                  bannerImage={event.bannerImage}
                  progress={50} // You can calculate this based on tickets sold vs total tickets
                  ticketSold={event.ticketsSold || 0}
                  totalTicket={event.totalTickets || 0}
                  onEdit={() => {
                    navigate(`/manageEvents/${event.slug}`, { state: { id: event.id } });
                  }}
                  onDuplicate={() => console.log('Duplicate clicked')}
                  onDelete={() => console.log('Delete clicked')}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-grey400">No events found.</div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
