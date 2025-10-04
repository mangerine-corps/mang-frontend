import AvailabilitySettings from "mangarine/components/ui-components/meetings/availability_settings";
import ConsultationHistory from "mangarine/components/ui-components/meetings/consultation_history";
import Preferences from "mangarine/components/ui-components/meetings/preferences";
import Pricing from "mangarine/components/ui-components/meetings/pricing";
import UpcomingAppointments from "mangarine/components/ui-components/meetings/upcoming_appointments";



function MyMeetings({page}: {page: string}) {

  return {
    ["availability_settings"]: <AvailabilitySettings />,
    ["preferences"]: <Preferences />,
    ["pricing"]: <Pricing />,
    // ["calendar"]: <Calendar />,
  }[page];
}

export default MyMeetings;
