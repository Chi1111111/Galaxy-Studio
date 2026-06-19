import { ArrowRight, Gift, Heart, Sparkles, Users } from "lucide-react";
import { Workshop } from "../types";
import { adultAudiences } from "../data/studioContent";

interface AdultExperienceSectionProps {
  lang: "zh" | "en";
  workshops: Workshop[];
  onSelectWorkshopToBook: (workshopId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function AdultExperienceSection({ lang, workshops, onSelectWorkshopToBook, setActiveTab }: AdultExperienceSectionProps) {
  const highlights = [
    ["零基础友好", "无需绘画或手作基础，老师会一步步引导完成作品。", "Beginner friendly", "No painting or craft background needed."],
    ["轻松治愈", "在安静舒适的环境中，享受色彩、材料和手作带来的放松感。", "Relaxing and mindful", "Enjoy color, materials, and a calming creative process."],
    ["适合多种场景", "适合情侣约会、朋友聚会、生日活动、亲子体验、宠物定制和小型团建。", "For many occasions", "Great for dates, friends, birthdays, family time, pet portraits, and teams."],
    ["可带走成品", "每次体验都可以完成一件属于自己的作品，把美好回忆带回家。", "Take your work home", "Finish your own artwork and bring the memory home."],
  ];

  return (
    <section className="bg-[#fbf7ef]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div className="anim-fade-up flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Adult Experiences</p>
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
            {lang === "zh" ? "成人艺术体验" : "Adult Art Experiences"}
          </h1>
          <p className="mt-6 leading-8 text-[#665448]">
            {lang === "zh"
              ? "给自己一段慢下来的时间，在艺术创作中放松、专注，也把美好带回家。成人艺术体验适合零基础学员，也适合情侣约会、朋友聚会、生日活动、亲子体验、宠物定制画和小型团建。"
              : "Slow down, focus, and take something beautiful home. Our adult experiences are suitable for beginners, dates, friends, birthdays, family sessions, pet portraits, and small team events."}
          </p>
          <button
            onClick={() => setActiveTab("booking")}
            className="soft-button mt-8 inline-flex w-fit items-center gap-3 bg-[#191715] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white"
          >
            {lang === "zh" ? "立即预约" : "Book Now"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="image-zoom anim-fade-up anim-delay-1 h-[420px]">
          <img src="/images/hero/adult-course.png" alt="Adult art experience" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="bg-[#f4eadc] py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-4 lg:px-8">
          {highlights.map((item, index) => {
            const Icon = [Sparkles, Heart, Users, Gift][index];
            return (
              <div key={item[0]} className="surface-card bg-[#fbf7ef] p-6">
                <Icon className="h-8 w-8 text-[#a36b4f]" />
                <h2 className="mt-5 font-serif text-xl font-bold">{lang === "zh" ? item[0] : item[2]}</h2>
                <p className="mt-3 text-sm leading-7 text-[#665448]">{lang === "zh" ? item[1] : item[3]}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Projects</p>
          <h2 className="mt-3 font-serif text-4xl font-bold">{lang === "zh" ? "成人体验项目" : "Adult Experience Projects"}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <article key={workshop.id} className="surface-card bg-[#f4eadc]">
              <div className="image-zoom h-56">
                <img src={workshop.imageUrl} alt={workshop.titleEn} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold">{lang === "zh" ? workshop.titleZh : workshop.titleEn}</h3>
                <p className="mt-3 text-sm leading-7 text-[#665448]">{lang === "zh" ? workshop.descriptionZh : workshop.descriptionEn}</p>
                <p className="mt-4 font-bold">{workshop.priceInfo}</p>
                <button onClick={() => onSelectWorkshopToBook(workshop.id)} className="soft-button mt-5 inline-flex items-center gap-2 bg-[#191715] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white">
                  {lang === "zh" ? "预约此项目" : "Book This"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-center font-serif text-4xl font-bold">{lang === "zh" ? "适合人群" : "Best For"}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {adultAudiences.map(([title, desc]) => (
              <div key={title} className="surface-card bg-[#f4eadc] p-6">
                <h3 className="font-serif text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#665448]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
