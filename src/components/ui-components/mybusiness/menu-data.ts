export const menuData = [
  {
    id: "dashboard",
    text: "My Dashboard ",
    icon: "/icons/account1.svg",
    href: "/my-business/dashboard",
    iconBg: "/icons/right.svg",
  },
  {
    id: "meetings",
    text: "My Meeting",
    icon: "/icons/privacy.svg",
    href: "/my-business/dashboard?tab=meetings",
    iconBg: "/icons/right.svg",
  },
  {
    id: "wallet",
    text: "My Wallet ",
    icon: "/icons/purplewallet.svg",
    href: "/my-business/dashboard?tab=wallet",
    iconBg: "/icons/right.svg",
  },
  {
    id: "myaccount",
    text: "My Account",
    icon: "/icons/payment1.svg",
    href: "/my-business/dashboard?tab=myaccount",
    iconBg: "/icons/right.svg",
  },
];

export type BusinessMenuItem = (typeof menuData)[number];
