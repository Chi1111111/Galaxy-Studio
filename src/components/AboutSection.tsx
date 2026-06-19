import { Bus, Car, Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";

interface AboutSectionProps {
  lang: "zh" | "en";
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const studioImages = [1, 2, 3, 4, 5, 6].map((n) => `/images/studio/${n}.png`);
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
          {studioImages.slice(0, 4).map((src, idx) => (
            <div key={src} className={`image-zoom surface-card h-56 ${idx % 2 ? "mt-8" : ""}`}>
              <img src={src} alt={`Studio ${idx + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card mt-16 grid gap-6 bg-[#f4eadc] p-8 md:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">{lang === "zh" ? "联系方式" : "Contact"}</h2>
          <p className="mt-3 text-sm leading-7 text-[#665448]">
            {lang === "zh"
              ? "如需预约试听、咨询体验项目或团体活动，请通过电话、微信或邮箱联系我们。"
              : "For trial classes, experience bookings, or group events, contact us by phone, WeChat, or email."}
          </p>
        </div>
        <div className="space-y-3 text-sm text-[#5b4a3f]">
          <p className="flex gap-2"><Phone className="h-4 w-4" />+64 27 236 9879</p>
          <p className="flex gap-2"><Mail className="h-4 w-4" />galaxyartstudio.nz@gmail.com</p>
          <p>WeChat: Galaxyart8</p>
        </div>
        <div className="space-y-3 text-sm text-[#5b4a3f]">
          <p className="flex gap-2"><Instagram className="h-4 w-4" />Instagram: galaxy_wl19</p>
          <p>Rednote: Galaxyart8</p>
          <p>{lang === "zh" ? "二维码图片可后续补充到页面。" : "QR code images can be added later."}</p>
        </div>
      </div>
    </section>
  );
}
