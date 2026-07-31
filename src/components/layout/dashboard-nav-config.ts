import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Gavel,
  Car,
  MessageSquare,
  Heart,
  Star,
  User,
  Store,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  exact?: boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Live Auction", to: "/vehicles/auction", icon: Car },
  { label: "Orders", to: "/dashboard/orders", icon: ShoppingBag, badge: 5 },
  { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  { label: "Bids", to: "/dashboard/bids", icon: Gavel, badge: 8 },
  { label: "Negotiations", to: "/dashboard/negotiations", icon: MessageSquare, badge: 2 },
  { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart },
  { label: "Favourites", to: "/dashboard/favourites", icon: Star },
  { label: "Portfolio", to: "/dashboard/portfolio", icon: Store },
  { label: "Profile", to: "/dashboard/profile", icon: User },
];
