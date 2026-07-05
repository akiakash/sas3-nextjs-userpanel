import { Globe, Clock, Phone, MessageCircle, Facebook, Twitter, Instagram, Youtube, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-black text-white text-xs">
      <div className="mx-auto flex min-h-10 max-w-[1400px] flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:h-10 sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <Globe size={14} /> English <ChevronDown size={12} />
          </span>
          <span className="hidden sm:inline">USD $ = 156 JPY</span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Clock size={14} /> Japan Time: 2:05 PM, Thursday
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-6">
          <span className="hidden items-center gap-1.5 lg:flex">
            <Phone size={14} /> +81-3-6411-7501
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} /> +81-80-3723-7007
          </span>
          <div className="ml-0 flex items-center gap-3 text-white/90 sm:ml-2">
            <Facebook size={14} />
            <Twitter size={14} />
            <Instagram size={14} className="hidden sm:block" />
            <Youtube size={14} className="hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
