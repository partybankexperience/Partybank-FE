
import SlideToggle from "../../components/inputs/SlideToggle";
import { useEventStore } from "../../stores/useEventStore";

const currentStage = "Notifications";

const notificationOptions = [
  "Email Notifications (Free)",
  "SMS Notifications (Paid Feature)",
  "Push Notifications (Future consideration if an app is developed)",
];

const Notification = () => {
  const { form, setFormValue } = useEventStore();
  const notificationForm = form[currentStage] || {};

  const handleToggleChange = (val: boolean) => {
    setFormValue(currentStage, "notifyOnTicketSale", val);
  };

  return (
    <div className="grid gap-[15px] mt-[1rem]">
      <div className="flex items-center justify-between w-full">
        <p className="font-bold text-[1rem]">
          Notify on Ticket Sale
        </p>
        <SlideToggle
          toggle={(val: any) => handleToggleChange(val)}
          defaultValue={notificationForm.notifyOnTicketSale || false}
          isChecked={notificationForm.notifyOnTicketSale || false}
        />
      </div>

      <ul className="grid gap-[10px] list-disc pl-5">
        {notificationOptions.map((label, idx) => (
          <li key={idx} className="text-[#918F90] text-[.8rem]">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
