import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard") && !pathname.includes("/dashboard/certificate"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/dashboard/certificate",
          label: "Sijil",
          active: pathname.includes("/dashboard/certificate"),
          icon: ShieldCheck,
          submenus: [],
        },
      ],
    },

    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
