import { BookOpen, Bus, Car, Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

interface AboutSectionProps {
  lang: "zh" | "en";
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const contactQrs = [
    { label: "WeChat", src: "/images/contact/wechat-qr.png" },
    { label: "WhatsApp", src: "/images/contact/whatsapp-qr.png" },
    { label: "Instagram", src: "/images/contact/instagram-qr.png" },
    { label: "RedNote", src: "/images/contact/rednote-qr.png" },
  ];
  const contactMethods = [
    { icon: Phone, label: "Phone", value: "+64 27 236 9879" },
    { icon: Mail, label: "Email", value: "galaxyartstudio.nz@gmail.com" },
    { icon: MessageCircle, label: "WeChat", value: "Galaxyart8" },
    { icon: Instagram, label: "Instagram", value: "galaxy_wl19" },
    { icon: BookOpen, label: "Rednote", value: "Galaxyart8" },
  ];
  const studioImages = [
    "/images/studio/home-1.jpg",
    "/images/studio/home-2.jpg",
    "/images/studio/home-3.jpg",
    "/images/studio/home-4.jpg",
  ];
  const details = [
    {
      icon: MapPin,
      zh: "2A/36 William Pickering Drive, Rosedale, Auckland",
      en: "2A/36 William Pickering Drive, Rosedale, Auckland",
    },
    {
      icon: Car,
      zh: "画室门口及周边停车方便，家长接送或到店参观都很轻松。",
      en: "Easy parking at and around the studio for drop-offs and visits.",
    },
    {
      icon: Bus,
      zh: "周边有公交线路可达，建议使用 Google Maps 查询最方便路线。",
      en: "Public transport is available nearby. Please check Google Maps for the best route.",
    },
    {
      icon: Clock,
      zh: "Mon-Sun 9:00 AM - 6:00 PM｜请提前预约",
      en: "Mon-Sun 9:00 AM - 6:00 PM | By appointment only",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="anim-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Our Studio</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            {lang === "zh" ? "安静、温暖、适合创作的 Rosedale 艺术空间" : "A warm, quiet creative studio in Rosedale"}
          </h1>
          <p className="mt-6 leading-8 text-[#665448]">
            {lang === "zh"
              ? "画室位于 Rosedale 交通便利的位置，环境安静舒适，适合孩子上课、成人体验和家长到店参观了解。我们提供儿童创意美术课程、成人艺术体验、生日活动、亲子体验、宠物定制和小型团建。"
              : "Located in convenient Rosedale, the studio is designed for children's art classes, adult creative experiences, parent visits, birthdays, family sessions, pet portraits, and small team events."}
          </p>
          <div className="mt-8 space-y-4">
            {details.map((item) => (
              <div key={item.zh} className="surface-card flex gap-3 bg-[#f4eadc] p-4 text-sm text-[#5b4a3f]">
                <item.icon className="h-5 w-5 flex-none text-[#a36b4f]" />
                <span>{lang === "zh" ? item.zh : item.en}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="anim-fade-up anim-delay-1 grid grid-cols-2 gap-4">
          {studioImages.map((src, idx) => (
            <div key={src} className={`image-zoom surface-card h-56 ${idx % 2 ? "mt-8" : ""}`}>
              <img src={src} alt={`Studio ${idx + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card mt-16 grid gap-10 bg-[#f4eadc] p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Contact Us</p>
          <h2 className="mt-3 font-serif text-3xl font-bold">{lang === "zh" ? "联系方式" : "Contact"}</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#665448]">
            {lang === "zh"
              ? "如需预约试听、咨询体验项目或团体活动，可以直接电话联系，也可以扫码添加常用社交平台。"
              : "For trial classes, experience bookings, or group events, call us directly or scan a preferred social channel."}
          </p>
          <div className="mt-7 grid gap-3 text-sm text-[#5b4a3f]">
            {contactMethods.map((method) => (
              <div key={method.label} className="grid grid-cols-[24px_88px_1fr] items-center gap-2 border-b border-[#2f241d]/10 pb-3 last:border-b-0">
                <method.icon className="h-4 w-4 text-[#a36b4f]" />
                <span className="font-semibold text-[#3f352e]">{method.label}</span>
                <span>{method.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div data-lightbox-ignore>
          <div className="flex items-end justify-between gap-4 border-b border-[#2f241d]/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Scan to Connect</p>
              <h3 className="mt-2 font-serif text-2xl font-bold">{lang === "zh" ? "扫码咨询" : "QR Codes"}</h3>
            </div>
            <p className="max-w-44 text-right text-xs leading-5 text-[#7b6c60]">
              {lang === "zh" ? "选择常用平台，扫码即可联系。" : "Choose your preferred platform."}
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {contactQrs.map((qr) => (
              <div key={qr.label} className="border border-[#2f241d]/10 bg-[#efe3d2] p-3 text-center">
                <img src={qr.src} alt={`${qr.label} QR code`} className="mx-auto w-full max-w-28 cursor-default object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
