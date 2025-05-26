import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  ShoppingBag,
  MessageSquare,
  Percent,
  ListChecks,
  Wrench
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
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
          href: "/admin",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href:"/admin/page-builder/puck/edit",
          label:"editpage",
          icon:Wrench
        },
        {
          href: "/admin/blogposts",
          label: "Blog Posts",
          icon: SquarePen,
        },
        {
          href: "/admin/category",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: "/admin/products",
          label: "Products",
          icon: ShoppingBag
        },
        {
          href: "/admin/orders",
          label: "Orders",
          icon: ListChecks
        },
        {
          href: "/admin/reviews",
          label: "Reviews",
          icon: MessageSquare
        },
        {
          href: "/admin/coupons",
          label: "Coupons",
          icon: Percent
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: Users
        },
        {
          href: "/admin/resource-dashboard",
          label: "Resource Dashboard",
          icon: LayoutGrid
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/admin/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
