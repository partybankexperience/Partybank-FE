
import { useEventStore } from "../../stores/useEventStore";
import { formatDate, formatTime } from "../../components/helpers/dateTimeHelpers";

const fieldLabels: Record<string, string> = {
  name: "Event Name",
  category: "Category",
  description: "Description",
  contactNumber: "Contact Number",
  tags: "Tags",
  series: "Series",
  coverImage: "Cover Image",
  eventVisibility: "Event Visibility",
  parkingAvailable: "Parking Available",
  transferCharges: "Transfer Event Charges to Customers",
  wheelchairAccess: "Wheelchair Access",
  transferChargesToCustomer: "Transfer Charges to Customers",
  venueName:'Venue Name',
  eventType:'Event Type',
  startDate:'Start Date',
  seriesName:'Series Name',
  endDate:'End Date',
  startTime:'Start Time',
  endTime:'End Time',
  selectedLocation:'Select Location',
  address:'Address',
  ticketCategory:'Ticket Category', 
  ticketType:'Ticket Type',
  ticketName:'Ticket Name',
  price:'Price',
  purchaseLimit:'Purchase Limit',
  totalStock:'Total Stock',
  soldTarget:'Sold Target',
  salesStart:'Sales Start',
  salesEnd:'Sales End',
  isUnlimited: ' Ticket Availability',
  color:'Color',
  perks:'Perks',
  groupSize:'Group Size',
  minAge:'Minimum Age',
  notifyOnTicketSale:'Notify on Ticket Sale',
  
  // Add more if needed...
};

const Review = () => {
  const { form } = useEventStore();
  console.log(form, "form");

  const state = [
    { step: "Event Setup", data: form["Event Setup"] },
    { step: "Schedule & Location", data: form["Schedule & Location"] },
    { step: "Tickets Create", data: form["Tickets Create"] },
    { step: "Accessibility", data: form["Accessibility"] },
    { step: "Notifications", data: form["Notifications"] },
    { step: "Event Guests", data: form["Event Guests"] },
    { step: "Review & Publish", data: form["Review & Publish"] },
  ];

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') {
      return "N/A";
    }

    // Handle eventType field
    if (key === 'eventType') {
      if (value === 'single-day') {
        return "Single day";
      } else if (value === 'multi-day') {
        return "Multiple days";
      }
    }

    // Handle date fields
    if (key === 'startDate' || key === 'endDate') {
      return formatDate(value);
    }

    // Handle time fields
    if (key === 'startTime' || key === 'endTime' || key === 'salesStart' || key === 'salesEnd') {
      return formatTime(value);
    }

    // Handle boolean values
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "N/A";
    }

    return String(value);
  };

  const renderTickets = (tickets: any[]) => {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return (
        <div className="text-[.9rem] text-[#979595]">
          No tickets created
        </div>
      );
    }

    return tickets.map((ticket, index) => (
      <div key={index} className="space-y-2 border-b border-gray-200 pb-4 mb-4 last:border-b-0">
        <h4 className="text-[1rem] font-semibold text-black">Ticket {index + 1}</h4>
        {Object.entries(ticket)
          .filter(([key]) => fieldLabels[key]) // Only show keys that have labels
          .map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-start gap-[10px]"
            >
              <p className="text-[.9rem] text-[#979595]">
                {fieldLabels[key]}
              </p>
              <p className="text-[.9rem] text-black max-w-[60%]">
                {formatValue(key, value)}
              </p>
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div className="space-y-6 mt-6">
      {state.map(({ step, data }) => {
        if (!data) return null;

        return (
          <div key={step} className="space-y-4">
            <h2 className="text-black text-[1rem] font-bold">{step}:</h2>
            <div className="grid gap-4">
              {/* Handle cover image first if it exists */}
              {data.coverImage && (
                <div className="w-full max-w-md">
                  <p className="text-[.9rem] text-[#979595] mb-2">
                    Cover Image
                  </p>
                  <img
                    src={data.coverImage}
                    alt="Event Cover"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              {/* Handle tickets array separately */}
              {step === "Tickets Create" && data.tickets ? (
                <div>
                  <p className="text-[.9rem] text-[#979595] mb-4">Tickets</p>
                  {renderTickets(data.tickets)}
                </div>
              ) : (
                /* Handle other fields */
                Object.entries(data)
                  .filter(([key]) => key !== "coverImage" && key !== "tickets" && fieldLabels[key]) // Filter out undefined labels and already handled fields
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start gap-[10px]"
                    >
                      <p className="text-[.9rem] text-[#979595]">
                        {fieldLabels[key]}
                      </p>
                      <p className="text-[.9rem] text-black max-w-[60%]">
                        {formatValue(key, value)}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
