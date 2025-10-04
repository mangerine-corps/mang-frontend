import { useAuth } from "mangarine/state/hooks/user.hook";
import { useEffect } from "react";

export interface NavLink {
  label: string;
  href: string;
  icon: {
    light: string;
    dark: string;
  };
  iconActive: {
    light: string;
    dark: string;
  };
}

export const NavLinks: NavLink[] = [
  {
    label: "Home",
    href: "/home",
    icon: {
      light: "/icons/navicons/homelight.svg",
      dark: "/icons/navicons/darkinactivehome.svg",
    },
    iconActive: {
      light: "/icons/navicons/homeactive.svg",
      dark: "/icons/navicons/darkhome.svg",
    },
  },
  {
    label: "Groups",
    href: "/groups",
    icon: {
      light: "/icons/navicons/commactive.svg",
      dark: "/icons/navicons/darkinactiveom.svg",
    },
    iconActive: {
      light: "/icons/navicons/lightcomm.svg",
      dark: "/icons/navicons/darkactivecomm.svg",
    },
  },

  {
    label: "Consultant",
    href: "/consultant",
    icon: {
      light: "/icons/navicons/lightconsult.svg",
      dark: "/icons/navicons/darkinactiveconsult.svg",
    },
    iconActive: {
      light: "/icons/navicons/activeconsultant.svg",
      dark: "/icons/navicons/darkactiveconsult.svg",
    },
  },
  {
    label: "My Consultations",
    href: "/consultation",
    icon: {
      light: "/icons/navicons/consult.svg",
      dark: "/icons/navicons/darkconsult.svg",
    },
    iconActive: {
      light: "/icons/navicons/activeconsult.svg",
      dark: "/icons/navicons/darkactconsult.svg",
    },
  },
  {
    label: "Message",
    href: "/message",
    icon: {
      light: "/icons/navicons/messagelight.svg",
      dark: "/icons/navicons/darkinactivemessage.svg",
    },
    iconActive: {
      light: "/icons/navicons/activemessage.svg",
      dark: "/icons/navicons/messagelight.svg",
    },
  },
  {
    label: "My Business",
    href: "/my-business",
    icon: {
      light: "/icons/navicons/business.svg",
      dark: "/icons/navicons/darkbus.svg",
    },
    iconActive: {
      light: "/icons/navicons/activebus.svg",
      dark: "/icons/navicons/darkactbus.svg",
    },
  },
  {
    label: "Notification",
    href: "/notification",
    icon: {
      light: "/icons/navicons/notiflight.svg",
      dark: "/icons/navicons/darkinactivenotif.svg",
    },
    iconActive: {
      light: "/icons/navicons/activenotif.svg",
      dark: "/icons/navicons/darkactivenotif.svg",
    },
  },
];
export const UserLinks: NavLink[] = [
  {
    label: "Home",
    href: "/home",
    icon: {
      light: "/icons/navicons/homelight.svg",
      dark: "/icons/navicons/darkinactivehome.svg",
    },
    iconActive: {
      light: "/icons/navicons/homeactive.svg",
      dark: "/icons/navicons/darkhome.svg",
    },
  },
  {
    label: "Groups",
    href: "/groups",
    icon: {
      light: "/icons/navicons/commactive.svg",
      dark: "/icons/navicons/darkinactiveom.svg",
    },
    iconActive: {
      light: "/icons/navicons/lightcomm.svg",
      dark: "/icons/navicons/darkactivecomm.svg",
    },
  },
  {
    label: "Consultant",
    href: "/consultant",
    icon: {
      light: "/icons/navicons/lightconsult.svg",
      dark: "/icons/navicons/darkinactiveconsult.svg",
    },
    iconActive: {
      light: "/icons/navicons/activeconsultant.svg",
      dark: "/icons/navicons/darkactiveconsult.svg",
    },
  },
  {
    label: "My Consultations",
    href: "/consultation",
    icon: {
      light: "/icons/navicons/consult.svg",
      dark: "/icons/navicons/darkconsult.svg",
    },
    iconActive: {
      light: "/icons/navicons/activeconsult.svg",
      dark: "/icons/navicons/darkactconsult.svg",
    },
  },
  {
    label: "Message",
    href: "/message",
    icon: {
      light: "/icons/navicons/messagelight.svg",
      dark: "/icons/navicons/darkinactivemessage.svg",
    },
    iconActive: {
      light: "/icons/navicons/activemessage.svg",
      dark: "/icons/navicons/messagelight.svg",
    },
  },

  {
    label: "Notification",
    href: "/notification",
    icon: {
      light: "/icons/navicons/notiflight.svg",
      dark: "/icons/navicons/darkinactivenotif.svg",
    },
    iconActive: {
      light: "/icons/navicons/activenotif.svg",
      dark: "/icons/navicons/darkactivenotif.svg",
    },
  },
];
const FilteredNavLinks = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user, "user in navitems");
  }, [user]);
  const isConsultant = user.isConsultant === true;

  return <>{isConsultant ? NavLinks : UserLinks}</>;
};

export default FilteredNavLinks;

// const currentUser = {
//    role:"Consultant", canAccess:false
// }
// const filteredNavLinks = NavLinks.filter(link => {
//   if (link.label === "Consultant"|| link.label === "My Consultations") {
//     return currentUser.role === "Consultant" && currentUser.canAccess;
//   }
//   return true; // Include all other links
// })
