interface AiInspirationProps {
  lang: "zh" | "en";
}

export default function AiInspiration({ lang }: AiInspirationProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-serif text-4xl font-bold">
        {lang === "zh" ? "AI 灵感功能待完善" : "AI inspiration is coming soon"}
      </h1>
      <p className="mt-4 text-[#665448]">
        {lang === "zh"
          ? "当前版本先聚焦画室主页、课程、价格与预约。"
          : "This first version focuses on the studio, classes, pricing, and booking flow."}
      </p>
    </section>
  );
}
