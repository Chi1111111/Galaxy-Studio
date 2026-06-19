import { ArrowRight, CalendarDays, Leaf, Palette, SmilePlus } from "lucide-react";

interface HomeSectionProps {
  lang: "zh" | "en";
  setActiveTab: (tab: string) => void;
}

const kidWorks = [
  "/images/works/kids/L1/1.jpg",
  "/images/works/kids/L2/1.jpg",
  "/images/works/kids/L3/1.jpg",
  "/images/works/kids/L4/1.jpg",
];
const adultWorks = [
  "/images/works/adult/1.png",
  "/images/works/adult/2.png",
  "/images/works/adult/1.png",
  "/images/works/adult/2.png",
];
const studioWorks = ["/images/studio/1.png", "/images/studio/2.png", "/images/studio/4.png", "/images/studio/5.png"];

export default function HomeSection({ lang, setActiveTab }: HomeSectionProps) {
  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const features = [
    {
      icon: Palette,
      titleZh: "专业艺术课程",
      titleEn: "Structured Art Classes",
      descZh: "系统课程设计，适合不同年龄与基础",
      descEn: "Structured learning for different ages and levels",
    },
    {
      icon: SmilePlus,
      titleZh: "温暖创作环境",
      titleEn: "Warm Studio Setting",
      descZh: "舒适美学空间，激发创造力",
      descEn: "A calm studio space that supports creativity",
    },
    {
      icon: Leaf,
      titleZh: "多元艺术体验",
      titleEn: "Mixed Media Experiences",
      descZh: "绘画、手作、综合材料等多种形式",
      descEn: "Painting, craft, mixed media, and more",
    },
    {
      icon: CalendarDays,
      titleZh: "灵活预约",
      titleEn: "Flexible Booking",
      descZh: "课程、体验课、团建活动均可预约",
      descEn: "Book classes, trials, and group events",
    },
  ];

  return (
    <div className="bg-[#f7f1e8]">
      <section className="relative min-h-[520px] overflow-hidden border-b-[10px] border-white md:min-h-[600px]">
        <img src="/images/studio/1.png" alt="Galaxy Art Studio classroom" className="hero-image-motion absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7f1e8]/95 via-[#f7f1e8]/72 to-transparent" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 md:min-h-[600px] lg:px-8">
          <div className="max-w-xl">
            <h1 className="anim-fade-up font-serif text-4xl font-medium leading-tight text-[#1f1a16] sm:text-5xl lg:text-6xl">
              {lang === "zh" ? "为孩子与成人打造的艺术创作空间" : "A Creative Art Space for Children and Adults"}
            </h1>
            <p className="anim-fade-up anim-delay-1 mt-7 text-sm leading-8 text-[#3f352e] sm:text-base">
              {lang === "zh"
                ? "Galaxy Art Studio 提供儿童创意美术课程与成人艺术体验。在这里，孩子探索想象力，成人享受创作的松弛感，每个人都能找到属于自己的艺术表达。"
                : "Galaxy Art Studio offers children's creative art classes and adult art experiences, helping every guest find their own form of artistic expression."}
            </p>
            <div className="anim-fade-up anim-delay-2 mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => go("kids")}
                className="soft-button inline-flex min-w-36 items-center justify-center gap-5 bg-[#191715] px-7 py-4 text-xs font-bold tracking-widest text-white"
              >
                {lang === "zh" ? "儿童课程" : "Kids Classes"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => go("adult")}
                className="soft-button inline-flex min-w-36 items-center justify-center gap-5 border border-[#1f1a16]/35 bg-[#f7f1e8]/70 px-7 py-4 text-xs font-bold tracking-widest text-[#1f1a16]"
              >
                {lang === "zh" ? "成人体验" : "Adult Experience"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid border-b-[10px] border-white lg:grid-cols-2">
        <CoursePanel
          title={lang === "zh" ? "儿童创意美术课程" : "Children's Creative Art Classes"}
          description={
            lang === "zh"
              ? "激发想象力与创造力，在色彩与材料中探索世界，表达自我。"
              : "Explore imagination, color, materials, and self-expression."
          }
          image="/images/hero/kids-course.png"
          accent="text-[#8ebcf0]"
          cta={lang === "zh" ? "了解更多" : "Learn More"}
          onClick={() => go("kids")}
        />
        <CoursePanel
          title={lang === "zh" ? "成人艺术体验" : "Adult Art Experiences"}
          description={
            lang === "zh"
              ? "给自己一段慢下来的时间，在艺术创作中放松身心，感受生活的美好。"
              : "Slow down, focus, and enjoy a relaxed guided studio experience."
          }
          image="/images/hero/adult-course.png"
          accent="text-[#ebb7c5]"
          cta={lang === "zh" ? "了解更多" : "Learn More"}
          reverse
          onClick={() => go("adult")}
        />
      </section>

      <section className="grid border-b border-white lg:grid-cols-3">
        <GalleryColumn title={lang === "zh" ? "孩子们的作品" : "Young Artists' Creations"} subtitle="Young Artists' Creations" images={kidWorks} />
        <GalleryColumn title={lang === "zh" ? "成人体验作品" : "Adult Workshop Creations"} subtitle="Adult Workshop Creations" images={adultWorks} />
        <GalleryColumn title={lang === "zh" ? "我们的工作室" : "Our Studio"} subtitle="Our Studio" images={studioWorks} />
      </section>

      <section className="grid gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-16">
        {features.map((feature) => (
          <div key={feature.titleEn} className="surface-card flex items-center gap-5 bg-[#f7f1e8] p-4">
            <feature.icon className="h-10 w-10 flex-none stroke-[1.4] text-[#1f1a16]" />
            <div>
              <h3 className="text-base font-bold text-[#1f1a16]">{lang === "zh" ? feature.titleZh : feature.titleEn}</h3>
              <p className="mt-1 text-xs leading-6 text-[#5d5047]">{lang === "zh" ? feature.descZh : feature.descEn}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function CoursePanel({
  title,
  description,
  image,
  accent,
  cta,
  reverse = false,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  accent: string;
  cta: string;
  reverse?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="surface-card grid min-h-[330px] border-r-[10px] border-white bg-[#f7f1e8] md:grid-cols-2">
      <div className={`anim-fade-up flex flex-col justify-center px-10 py-12 ${reverse ? "md:order-1" : ""}`}>
        <div className={`mb-5 text-5xl font-light ${accent}`}>~</div>
        <h2 className="font-serif text-3xl font-medium text-[#1f1a16]">{title}</h2>
        <div className="draw-line mt-4 h-px w-8 bg-[#1f1a16]" />
        <p className="mt-5 max-w-xs text-sm leading-7 text-[#3f352e]">{description}</p>
        <button onClick={onClick} className="soft-button mt-8 inline-flex w-fit items-center gap-5 bg-[#191715] px-6 py-3 text-xs font-bold tracking-widest text-white">
          {cta}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="image-zoom h-full min-h-[280px]">
        <img src={image} alt={title} className="h-full min-h-[280px] w-full object-cover" />
      </div>
    </div>
  );
}

function GalleryColumn({ title, subtitle, images }: { title: string; subtitle: string; images: string[] }) {
  return (
    <div className="surface-card border-r-[10px] border-white px-8 py-8 text-center">
      <h2 className="font-serif text-2xl font-medium text-[#1f1a16]">{title}</h2>
      <p className="mt-1 text-xs tracking-wider text-[#6b625d]">{subtitle}</p>
      <div className="mt-7 grid h-[260px] grid-cols-3 grid-rows-2 gap-2">
        <div className="image-zoom col-start-1 row-start-1"><img src={images[0]} alt={title} className="h-full w-full object-cover" /></div>
        <div className="image-zoom col-start-2 row-span-2 row-start-1"><img src={images[1]} alt={title} className="h-full w-full object-cover" /></div>
        <div className="image-zoom col-start-3 row-start-1"><img src={images[2]} alt={title} className="h-full w-full object-cover" /></div>
        <div className="image-zoom col-start-1 row-start-2"><img src={images[3]} alt={title} className="h-full w-full object-cover" /></div>
      </div>
    </div>
  );
}
