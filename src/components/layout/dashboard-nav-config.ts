import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Gavel,
  Car,
  MessageSquare,
  Heart,
  User,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { PortalSummary } from "@/lib/portal-api";

export type DashboardNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badgeKey?: keyof PortalSummary;
  exact?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Live Auction", to: "/vehicles/auction", icon: Car },
  { label: "Orders", to: "/dashboard/orders", icon: ShoppingBag, badgeKey: "orders" },
  { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  { label: "Bids", to: "/dashboard/bids", icon: Gavel, badgeKey: "bids" },
  {
    label: "Negotiations",
    to: "/dashboard/negotiations",
    icon: MessageSquare,
    badgeKey: "negotiations",
  },
  { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart, badgeKey: "wishlist" },
  { label: "Portfolio", to: "/dashboard/portfolio", icon: Store },
  { label: "Profile", to: "/dashboard/profile", icon: User },
];
