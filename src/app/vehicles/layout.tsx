import "@/styles/auction.css";
import { AuctionChrome } from "@/components/layout/auction-chrome";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuctionChrome>{children}</AuctionChrome>;
}
