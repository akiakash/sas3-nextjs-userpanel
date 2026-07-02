import Link from "next/link";
import { LogOut, User } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import { Sas3Logo } from "@/components/layout/sas3-logo";

const publicNav = [
  { label: "HOME", href: "/" },
  { label: "STOCK", href: "/" },
  { label: "AUCTION", href: "/" },
  { label: "ABOUT US", href: "/" },
  { label: "HOW TO BUY", href: "/" },
  { label: "BANK DETAILS", href: "/" },
  { label: "CONTACT", href: "/" },
];

export function DashboardHeader() {
  return (
    <div className="shrink-0">
      <TopBar />

      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 sm:h-24 sm:px-6">
          <Sas3Logo height={72} linkTo="/" priority />

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex xl:gap-8">
            {publicNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:text-brand-red"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="relative py-2 text-[13px] font-semibold text-brand-red"
            >
              MY ACCOUNT
              <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-brand-red" />
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white shadow-sm transition hover:bg-brand-redDark"
              title="Profile"
              aria-label="Profile"
            >
              <User size={18} />
            </Link>

            <Link
              href="/login"
              className="flex h-10 w-10 items-center justify-center rounded border border-gray-200 text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default DashboardHeader;
