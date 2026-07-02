import { Globe, Clock, Phone, MessageCircle, Facebook, Twitter, Instagram, Youtube, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-black text-white text-xs">
      <div className="max-w-[1400px] mx-auto px-6 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Globe size={14} /> English <ChevronDown size={12} />
          </span>
          <span>USD $ = 156 JPY</span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> Japan Time: 2:05 PM, Thursday
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Phone size={14} /> +81-3-6411-7501</span>
          <span className="flex items-center gap-1.5"><MessageCircle size={14} /> +81-80-3723-7007</span>
          <div className="flex items-center gap-3 ml-2 text-white/90">
            <Facebook size={14} />
            <Twitter size={14} />
            <Instagram size={14} />
            <Youtube size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
