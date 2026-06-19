interface GallerySectionProps {
  lang: "zh" | "en";
}

const kidsLevels = [
  {
    level: "L1",
    titleZh: "艺术启蒙阶段",
    titleEn: "Art Introduction",
    ageZh: "3-5岁",
    ageEn: "Ages 3-5",
    images: ["/images/works/kids/L1/1.jpg", "/images/works/kids/L1/2.jpg", "/images/works/kids/L1/3.jpg"],
  },
  {
    level: "L2",
    titleZh: "创意探索阶段",
    titleEn: "Creative Exploration",
    ageZh: "5-7岁",
    ageEn: "Ages 5-7",
    images: ["/images/works/kids/L2/1.jpg", "/images/works/kids/L2/2.jpg", "/images/works/kids/L2/3.jpg"],
  },
  {
    level: "L3",
    titleZh: "基础造型阶段",
    titleEn: "Foundational Form",
    ageZh: "7-9岁",
    ageEn: "Ages 7-9",
    images: ["/images/works/kids/L3/1.jpg", "/images/works/kids/L3/2.jpg", "/images/works/kids/L3/3.jpg"],
  },
  {
    level: "L4",
    titleZh: "综合创作阶段",
    titleEn: "Integrated Creation",
    ageZh: "9岁以上",
    ageEn: "Age 9+",
    images: ["/images/works/kids/L4/1.jpg", "/images/works/kids/L4/2.jpg", "/images/works/kids/L4/3.jpg"],
  },
  {
    level: "L5",
    titleZh: "独立表达阶段",
    titleEn: "Independent Expression",
    ageZh: "10岁以上",
    ageEn: "Age 10+",
    images: [
      "/images/works/kids/L5/1.png",
      "/images/works/kids/L5/2.png",
      "/images/works/kids/L5/3.png",
      "/images/works/kids/L5/4.png",
      "/images/works/kids/L5/5.png",
      "/images/works/kids/L5/6.png",
    ],
  },
];

const adultImages = ["/images/works/adult/1.png", "/images/works/adult/2.png"];

export default function GallerySection({ lang }: GallerySectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="anim-fade-up text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Gallery</p>
        <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">{lang === "zh" ? "作品展示" : "Gallery"}</h1>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#665448]">
          {lang === "zh"
            ? "儿童作品按课程级别展示，方便家长了解不同阶段的学习成果；成人体验作品单独展示。"
            : "Children's work is grouped by course level, with adult workshop pieces shown separately."}
        </p>
      </div>

      <div className="mt-14">
        <div className="flex flex-col justify-between gap-3 border-b border-[#2f241d]/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Young Artists</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{lang === "zh" ? "孩子们的作品" : "Young Artists' Creations"}</h2>
          </div>
          <p className="text-sm text-[#665448]">{lang === "zh" ? "按 L1-L5 分级展示" : "Grouped by L1-L5"}</p>
        </div>

        <div className="mt-8 space-y-10">
          {kidsLevels.map((level) => (
            <section key={level.level} className="anim-fade-up">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-sm font-bold text-[#a36b4f]">{level.level}</p>
                  <h3 className="font-serif text-2xl font-bold">{lang === "zh" ? level.titleZh : level.titleEn}</h3>
                </div>
                <span className="border border-[#2f241d]/10 px-3 py-1 text-xs font-bold text-[#5b4a3f]">
                  {lang === "zh" ? level.ageZh : level.ageEn}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {level.images.map((image, index) => (
                  <div key={image} className="image-zoom surface-card h-72">
                    <img
                      src={image}
                      alt={`${level.level} ${lang === "zh" ? "儿童作品" : "student artwork"} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <GalleryGroup
        title={lang === "zh" ? "成人体验作品" : "Adult Workshop Creations"}
        subtitle="Adult Workshop Creations"
        images={adultImages}
      />
    </section>
  );
}

function GalleryGroup({ title, subtitle, images }: { title: string; subtitle: string; images: string[] }) {
  return (
    <div className="anim-fade-up mt-16">
      <div className="border-b border-[#2f241d]/10 pb-5">
        <h2 className="font-serif text-3xl font-bold">{title}</h2>
        <p className="mt-1 text-xs tracking-wider text-[#6b625d]">{subtitle}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image} className="image-zoom surface-card h-72">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
