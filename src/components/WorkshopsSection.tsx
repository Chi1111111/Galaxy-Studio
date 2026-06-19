import React from "react";
import { ArrowRight, Check, Filter } from "lucide-react";
import { Workshop } from "../types";

interface WorkshopsSectionProps {
  lang: "zh" | "en";
  workshops: Workshop[];
  onSelectWorkshopToBook: (workshopId: string) => void;
}

type CategoryFilter = "all" | "painting" | "mirror" | "scent" | "crafts";

export default function WorkshopsSection({ lang, workshops, onSelectWorkshopToBook }: WorkshopsSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>("all");
  const filtered = workshops.filter((workshop) => selectedCategory === "all" || workshop.category === selectedCategory);
  const categories = [
    { id: "all", zh: "全部项目", en: "All" },
    { id: "painting", zh: "绘画类", en: "Painting" },
    { id: "mirror", zh: "镜子肌理", en: "Mirror" },
    { id: "scent", zh: "香氛手作", en: "Scent" },
    { id: "crafts", zh: "轻手作", en: "Crafts" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Classes & Experiences</p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
          {lang === "zh" ? "课程与艺术体验" : "Classes and Creative Experiences"}
        </h1>
        <p className="mt-5 leading-8 text-[#665448]">
          {lang === "zh"
            ? "材料全包、零基础友好、老师指导、成品可带回家。儿童课程欢迎预约试听，成人体验请提前预约。"
            : "Materials included, beginner friendly, guided by teachers, and every finished piece goes home with you."}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <Filter className="h-4 w-4 text-[#a36b4f]" />
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as CategoryFilter)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${
              selectedCategory === category.id
                ? "bg-[#2f241d] text-white"
                : "border border-[#2f241d]/15 bg-[#f4eadc] text-[#5b4a3f]"
            }`}
          >
            {lang === "zh" ? category.zh : category.en}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((workshop) => (
          <article key={workshop.id} className="flex h-full flex-col overflow-hidden bg-[#f4eadc]">
            <img src={workshop.imageUrl} alt={workshop.titleEn} className="h-60 w-full object-cover" />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#a36b4f]">{workshop.duration}</span>
                <span className="bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {workshop.difficulty}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold">{lang === "zh" ? workshop.titleZh : workshop.titleEn}</h2>
              <p className="mt-3 text-sm leading-7 text-[#665448]">{lang === "zh" ? workshop.descriptionZh : workshop.descriptionEn}</p>
              <ul className="mt-5 space-y-2">
                {(lang === "zh" ? workshop.highlightsZh : workshop.highlightsEn).slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[#5b4a3f]">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-[#a36b4f]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                <p className="font-serif text-lg font-bold">{workshop.priceInfo}</p>
                <button
                  onClick={() => onSelectWorkshopToBook(workshop.id)}
                  className="inline-flex items-center gap-2 bg-[#2f241d] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white"
                >
                  {lang === "zh" ? "预约" : "Book"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
