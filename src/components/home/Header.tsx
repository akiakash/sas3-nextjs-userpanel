import Link from "next/link";
import { User, UserPlus } from "lucide-react";
import { Sas3Logo } from "@/components/layout/sas3-logo";
import { cn } from "@/lib/utils";

const nav = ["HOME", "STOCK", "AUCTION", "ABOUT US", "HOW TO BUY", "BANK DETAILS", "CONTACT"];

type HeaderProps = {
  activeAuth?: "login" | "register";
};

export default function Header({ activeAuth }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <Sas3Logo height={88} priority className="sm:h-[92px]" linkTo="/" />

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
          {nav.map((n, i) => (
            <Link
              key={n}
              href="/"
              className={cn(
                "relative py-2 text-[13px] font-semibold transition-colors hover:text-brand-red",
                i === 0 && !activeAuth ? "text-brand-red" : "text-gray-700"
              )}
            >
              {n}
              {i === 0 && !activeAuth && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-brand-red" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/login"
            className={cn(
              "flex items-center gap-2 rounded border px-4 py-2.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition sm:px-5",
              activeAuth === "login"
                ? "border-brand-red bg-brand-red/5 text-brand-red"
                : "border-zinc-300 bg-white/60 text-zinc-900 hover:border-zinc-400 hover:bg-white"
            )}
          >
            <User size={16} /> LOGIN
          </Link>
          <Link
            href="/register"
            className={cn(
              "flex items-center gap-2 rounded px-4 py-2.5 text-sm font-semibold transition sm:px-5",
              activeAuth === "register"
                ? "ring-2 ring-brand-red ring-offset-2"
                : "",
              "bg-brand-red text-white hover:bg-brand-redDark"
            )}
          >
            <UserPlus size={16} /> REGISTER
          </Link>
        </div>
      </div>
    </header>
  );
}
