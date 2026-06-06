export const menuData = [
  {
    id: "dashboard",
    text: "My Dashboard",
    icon: "/icons/account1.svg",
    href: "/my-business/dashboard",
    iconBg: "/icons/right.svg",
    iconBgColor: "rgba(48, 188, 13, 0.08)",
  },
  {
    id: "meetings",
    text: "My Meeting",
    icon: "/icons/privacy.svg",
    href: "/my-business/dashboard?tab=meetings",
    iconBg: "/icons/right.svg",
    iconBgColor: "rgba(54, 56, 83, 0.08)",
  },
  {
    id: "wallet",
    text: "My Wallet",
    icon: "/icons/purplewallet.svg",
    href: "/my-business/dashboard?tab=wallet",
    iconBg: "/icons/right.svg",
    iconBgColor: "rgba(247, 26, 252, 0.08)",
  },
  {
    id: "myaccount",
    text: "My Account",
    icon: "/icons/payment1.svg",
    href: "/my-business/dashboard?tab=myaccount",
    iconBg: "/icons/right.svg",
    iconBgColor: "rgba(39, 51, 218, 0.08)",
  },
];

export type BusinessMenuItem = (typeof menuData)[number];
