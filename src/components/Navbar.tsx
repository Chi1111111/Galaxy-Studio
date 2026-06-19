import React from "react";
import { Calendar, Globe2, Menu, X } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: "zh" | "en";
  setLang: (lang: "zh" | "en") => void;
}

const tabs = [
  { id: "home", labelZh: "首页", labelEn: "Home" },
  { id: "kids", labelZh: "儿童课程", labelEn: "Kids Classes" },
  { id: "adult", labelZh: "成人体验", labelEn: "Adult Experiences" },
  { id: "gallery", labelZh: "作品展示", labelEn: "Gallery" },
  { id: "booking", labelZh: "预约 & 价格", labelEn: "Booking & Pricing" },
  { id: "about", labelZh: "关于我们", labelEn: "About" },
];

export default function Navbar({ activeTab, setActiveTab, lang, setLang }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const go = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f3ea]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <button className="transition-opacity hover:opacity-75 text-left" onClick={() => go("home")}>
          <span className="block font-serif text-xl font-bold leading-none text-[#191715]">Galaxy Art Studio</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-[#5d5047]">
            星河艺术空间 · Rosedale
          </span>
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => go(tab.id)}
              className={`relative py-2 text-sm font-semibold tracking-wider text-[#191715] transition hover:text-[#a36b4f] ${
                activeTab === tab.id ? "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#191715]" : ""
              }`}
            >
              {lang === "zh" ? tab.labelZh : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-7 lg:flex">
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#191715] transition hover:text-[#a36b4f]"
          >
            <Globe2 className="h-4 w-4" />
            {lang === "zh" ? "English" : "中文"}
          </button>
          <button
            onClick={() => go("booking")}
            className="soft-button inline-flex items-center gap-3 bg-[#191715] px-8 py-4 text-sm font-bold tracking-widest text-white"
          >
            <Calendar className="h-5 w-5" />
            {lang === "zh" ? "立即预约" : "Book Now"}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} className="px-3 py-2 text-xs font-bold">
            {lang === "zh" ? "EN" : "中"}
          </button>
          <button onClick={() => setIsOpen((value) => !value)} className="p-2 text-[#191715]">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-black/10 bg-[#f8f3ea] px-5 pb-5 lg:hidden">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => go(tab.id)} className="block w-full py-4 text-left text-sm font-bold">
              {lang === "zh" ? tab.labelZh : tab.labelEn}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
