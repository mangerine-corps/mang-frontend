import AvailabilitySettings from "mangarine/components/ui-components/meetings/availability_settings";
import ConsultationHistory from "mangarine/components/ui-components/meetings/consultation_history";
import Preferences from "mangarine/components/ui-components/meetings/preferences";
import Pricing from "mangarine/components/ui-components/meetings/pricing";
import UpcomingAppointments from "mangarine/components/ui-components/meetings/upcoming_appointments";

function MyMeetings({ page, onAvailabilitySaved }: { page: string; onAvailabilitySaved?: () => void }) {
  return (
    {
      ["availability_settings"]: <AvailabilitySettings onSaveSuccess={onAvailabilitySaved} />,
      ["preferences"]: <Preferences />,
      ["pricing"]: <Pricing />,
      // ["calendar"]: <AvailabilitySettings />,
      ["upcoming_appointments"]: <UpcomingAppointments />,
      ["consultation_history"]: <ConsultationHistory />,
    }[page] ?? <AvailabilitySettings onSaveSuccess={onAvailabilitySaved} />
  );
}

export default MyMeetings;
