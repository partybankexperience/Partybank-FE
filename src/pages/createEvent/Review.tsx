import { useEventStore } from "../../stores/useEventStore";

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
  startDate:'Start Date'
  // Add more if needed...
};

const Review = () => {
  const { form } = useEventStore();

  const state = [
    { step: "Event Setup", data: form["Event Setup"] },
    { step: "Schedule & Location", data: form["Schedule & Location"] },
    { step: "Tickets Create", data: form["Tickets Create"] },
    { step: "Accessibility", data: form["Accessibility"] },
    { step: "Notifications", data: form["Notifications"] },
    { step: "Event Guests", data: form["Event Guests"] },
    { step: "Review & Publish", data: form["Review & Publish"] },
  ];

  return (
    <div className="space-y-6 mt-6">
      {state.map(({ step, data }) => {
        if (!data) return null;

        return (
          <div key={step} className="space-y-4">
            <h2 className="text-black text-[1rem] font-bold">{step}:</h2>
            <div className="grid gap-4">
              {Object.entries(data).map(([key, value]) => {
                if (key === "coverImage" && value instanceof File) {
                  const previewUrl = URL.createObjectURL(value);
                  return (
                    <div key={key} className="w-full max-w-md">
                      <p className="text-[.9rem] text-[#979595] mb-2">
                        {fieldLabels[key] || key}
                      </p>
                      <img
                        src={previewUrl}
                        alt="Event Cover"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="flex justify-between items-start gap-[10px]"
                  >
                    <p className="text-[.9rem] text-[#979595]">
                      {fieldLabels[key] || key}
                    </p>
                    <p className="text-[.9rem] text-black max-w-[60%]">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Review;
