import React from "react";
import { BookOpen, Calendar, Instagram, Mail, MapPin, MessageCircle, Phone, X } from "lucide-react";
import Navbar from "./components/Navbar";
import HomeSection from "./components/HomeSection";
import KidsCourseSection from "./components/KidsCourseSection";
import AdultExperienceSection from "./components/AdultExperienceSection";
import GallerySection from "./components/GallerySection";
import BookingSection from "./components/BookingSection";
import BookingDashboard from "./components/BookingDashboard";
import AboutSection from "./components/AboutSection";
import { workshopsData } from "./data/workshops";
import { studioContact } from "./data/studioContent";

export default function App() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [isAdminPage, setIsAdminPage] = React.useState(() => window.location.pathname.replace(/\/$/, "") === "/admin");
  const [lang, setLang] = React.useState<"zh" | "en">("zh");
  const [selectedWorkshopId, setSelectedWorkshopId] = React.useState("");
  const [lightbox, setLightbox] = React.useState<{ src: string; alt: string } | null>(null);

  const leaveAdmin = (tab: string) => {
    window.history.pushState({}, "", "/");
    setIsAdminPage(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectWorkshopToBook = (workshopId: string) => {
    setSelectedWorkshopId(workshopId);
    setActiveTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const openImage = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-lightbox-ignore]")) return;
    const target = event.target as HTMLElement;
    if (target instanceof HTMLImageElement) {
      setLightbox({
        src: target.currentSrc || target.src,
        alt: target.alt || "Galaxy Art Studio image",
      });
    }
  };

  return isAdminPage ? (
    <div className="min-h-screen bg-[#fbf7ef] text-[#2b211b]">
      <BookingDashboard lang={lang} setActiveTab={leaveAdmin} />
    </div>
  ) : (
    <div className="min-h-screen bg-[#fbf7ef] text-[#2b211b]" onClickCapture={openImage}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />
      <main>
        {activeTab === "home" && <HomeSection lang={lang} setActiveTab={setActiveTab} />}
        {activeTab === "kids" && <KidsCourseSection lang={lang} setActiveTab={setActiveTab} />}
        {activeTab === "adult" && (
          <AdultExperienceSection
            lang={lang}
            workshops={workshopsData}
            onSelectWorkshopToBook={selectWorkshopToBook}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "gallery" && <GallerySection lang={lang} />}
        {activeTab === "booking" && (
          <BookingSection
            lang={lang}
            workshops={workshopsData}
            selectedWorkshopId={selectedWorkshopId}
            setSelectedWorkshopId={setSelectedWorkshopId}
            onBookingSuccess={() => setActiveTab("booking")}
          />
        )}
        {activeTab === "about" && <AboutSection lang={lang} />}
      </main>

      <footer className="border-t border-[#2f241d]/10 bg-[#f1e7d8] py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1.1fr_1fr] lg:px-8">
          <div>
            <div data-lightbox-ignore className="flex items-center gap-3">
              <img src="/images/brand/galaxy-logo.jpg" alt="Galaxy Art Studio" className="h-12 w-28 object-contain object-left mix-blend-multiply" />
              <h3 className="font-serif text-2xl font-bold">Galaxy Art Studio</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6f5d4f]">
              {lang === "zh"
                ? "奥克兰儿童美术与成人艺术体验空间，为孩子与成人打造温暖、有质感的创作时光。"
                : "Auckland art classes and creative experiences for children, adults, families, and groups."}
            </p>
          </div>
          <div className="grid gap-6 text-sm text-[#5b4a3f] sm:grid-cols-2 lg:grid-cols-1">
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#2b211b]">{lang === "zh" ? "到访信息" : "Visit"}</h4>
              <p className="flex gap-2"><MapPin className="h-4 w-4 flex-none" />{studioContact.address}</p>
              <p className="flex gap-2"><Calendar className="h-4 w-4 flex-none" />{studioContact.hours} · By appointment only</p>
              <p className="flex gap-2"><Phone className="h-4 w-4 flex-none" />{studioContact.phone}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#2b211b]">{lang === "zh" ? "联系方式" : "Contact"}</h4>
              <p className="flex gap-2"><Mail className="h-4 w-4 flex-none" /><span className="break-all">{studioContact.email}</span></p>
              <p className="flex gap-2"><MessageCircle className="h-4 w-4 flex-none" />WeChat: {studioContact.wechat}</p>
              <p className="flex gap-2"><Instagram className="h-4 w-4 flex-none" />{studioContact.instagram}</p>
              <p className="flex gap-2"><BookOpen className="h-4 w-4 flex-none" />Rednote: {studioContact.rednote}</p>
            </div>
          </div>
          <div data-lightbox-ignore>
            <div className="mb-4">
              <h4 className="font-serif text-lg font-bold text-[#2b211b]">{lang === "zh" ? "扫码联系" : "Scan"}</h4>
              <p className="mt-1 text-xs leading-5 text-[#7b6c60]">{lang === "zh" ? "任选一个平台扫码联系。" : "Scan any preferred platform."}</p>
            </div>
            <div className="grid max-w-md grid-cols-4 gap-2">
              {[
                ["WeChat", "/images/contact/wechat-qr.png"],
                ["WhatsApp", "/images/contact/whatsapp-qr.png"],
                ["Instagram", "/images/contact/instagram-qr.png"],
                ["RedNote", "/images/contact/rednote-qr.png"],
              ].map(([label, src]) => (
                <div key={label} className="bg-[#f1e7d8] p-1">
                  <img src={src} alt={`${label} QR code`} className="w-full cursor-default object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {lightbox && (
        <div
          data-lightbox-ignore
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#191715] shadow-xl transition hover:bg-white"
            onClick={() => setLightbox(null)}
            aria-label={lang === "zh" ? "关闭大图" : "Close image"}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[88vh] max-w-[92vw] cursor-zoom-out object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
