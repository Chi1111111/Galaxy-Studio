import { ArrowRight, Brush, Layers, MessageCircle } from "lucide-react";
import { kidsLevels } from "../data/studioContent";

interface KidsCourseSectionProps {
  lang: "zh" | "en";
  setActiveTab: (tab: string) => void;
}

export default function KidsCourseSection({ lang, setActiveTab }: KidsCourseSectionProps) {
  const highlights = [
    {
      icon: Layers,
      titleZh: "阶段式课程体系",
      titleEn: "Level-based curriculum",
      descZh: "根据孩子年龄与能力设置 L1-L5 分级课程，从启蒙探索到独立创作，帮助孩子循序渐进地成长。",
      descEn: "L1-L5 classes are designed around age and ability, helping children grow step by step.",
    },
    {
      icon: Brush,
      titleZh: "多元材料探索",
      titleEn: "Mixed media exploration",
      descZh: "课程结合绘画、拼贴、综合材料、手工、版画等形式，让孩子在不同材料中打开想象力。",
      descEn: "Drawing, collage, craft, printmaking, and mixed materials open up imagination.",
    },
    {
      icon: MessageCircle,
      titleZh: "重视表达与创造力",
      titleEn: "Expression and creativity",
      descZh: "我们不追求统一答案，而是鼓励孩子观察、思考和表达，建立属于自己的创作方式。",
      descEn: "We encourage observation, thinking, and personal expression rather than one fixed answer.",
    },
  ];

  return (
    <section className="bg-[#fbf7ef]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
        <div className="anim-fade-up flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Kids Art Curriculum</p>
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
            {lang === "zh" ? "儿童创意美术课程" : "Creative Art Classes for Children"}
          </h1>
          <p className="mt-6 leading-8 text-[#665448]">
            {lang === "zh"
              ? "不是简单地“画得像”，而是帮助孩子一步步建立观察力、想象力和艺术表达力。Galaxy Art Studio 根据孩子不同年龄阶段与能力发展，设计了 L1-L5 分级课程体系。"
              : "Not just drawing something that looks right. Our L1-L5 curriculum helps children build observation, imagination, and artistic expression step by step."}
          </p>
          <button
            onClick={() => setActiveTab("booking")}
            className="soft-button mt-8 inline-flex w-fit items-center gap-3 bg-[#191715] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white"
          >
            {lang === "zh" ? "预约试听" : "Book a Trial"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="image-zoom anim-fade-up anim-delay-1 h-[420px]">
          <img src="/images/hero/kids-course.png" alt="Kids creative art class" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="bg-[#f4eadc] py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 lg:px-8">
          {highlights.map((item) => (
            <div key={item.titleEn} className="surface-card bg-[#fbf7ef] p-7">
              <item.icon className="h-8 w-8 text-[#a36b4f]" />
              <h2 className="mt-5 font-serif text-2xl font-bold">{lang === "zh" ? item.titleZh : item.titleEn}</h2>
              <p className="mt-3 text-sm leading-7 text-[#665448]">{lang === "zh" ? item.descZh : item.descEn}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">L1-L5</p>
          <h2 className="mt-3 font-serif text-4xl font-bold">{lang === "zh" ? "儿童课程体系 L1-L5" : "Children's L1-L5 Course System"}</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-5">
          {kidsLevels.map((level) => (
            <article key={level.level} className="surface-card border border-[#2f241d]/10 bg-[#f4eadc] p-6">
              <p className="font-mono text-sm font-bold text-[#a36b4f]">{level.level}</p>
              <h3 className="mt-2 font-serif text-xl font-bold">{lang === "zh" ? level.titleZh : level.titleEn}</h3>
              <p className="mt-2 text-sm font-bold text-[#5b4a3f]">{lang === "zh" ? level.ageZh : level.ageEn}</p>
              <p className="mt-4 text-sm leading-7 text-[#665448]">{lang === "zh" ? level.descriptionZh : level.descriptionEn}</p>
              <p className="mt-4 border-t border-[#2f241d]/10 pt-4 text-xs leading-6 text-[#5b4a3f]">
                {lang === "zh" ? level.focusZh : level.focusEn}
              </p>
              <p className="mt-4 font-serif text-lg font-bold">{level.price}</p>
            </article>
          ))}
        </div>
        <div className="surface-card mt-12 bg-[#f4eadc] p-8 text-center">
          <h3 className="font-serif text-2xl font-bold">{lang === "zh" ? "预约试听课" : "Book a Trial Class"}</h3>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#665448]">
            {lang === "zh"
              ? "欢迎预约试听课，老师会根据孩子的年龄、基础和兴趣，推荐合适的课程级别。试听后如报名 Term 课程，可咨询是否享有试听抵扣或报名优惠。"
              : "Book a trial class and our teacher will recommend a suitable level based on your child's age, foundation, and interests."}
          </p>
          <button onClick={() => setActiveTab("booking")} className="soft-button mt-6 bg-[#191715] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white">
            {lang === "zh" ? "立即预约试听" : "Book Trial"}
          </button>
        </div>
      </div>
    </section>
  );
}
