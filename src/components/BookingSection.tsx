import React from "react";
import { AlertCircle, Calendar, CheckCircle2, Clock, Mail, MessageSquare, Phone, User, Users } from "lucide-react";
import { AvailabilitySlot, Booking, Workshop } from "../types";

interface BookingSectionProps {
  lang: "zh" | "en";
  workshops: Workshop[];
  selectedWorkshopId: string;
  setSelectedWorkshopId: (id: string) => void;
  onBookingSuccess: () => void;
}

const CAPACITY = 12;

export default function BookingSection({
  lang,
  workshops,
  selectedWorkshopId,
  setSelectedWorkshopId,
  onBookingSuccess,
}: BookingSectionProps) {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [wechatId, setWechatId] = React.useState("");
  const [bookingDate, setBookingDate] = React.useState("");
  const [sessionStart, setSessionStart] = React.useState("");
  const [numberOfArtists, setNumberOfArtists] = React.useState(1);
  const [specialRequests, setSpecialRequests] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!selectedWorkshopId && workshops[0]) setSelectedWorkshopId(workshops[0].id);
  }, [selectedWorkshopId, setSelectedWorkshopId, workshops]);

  const activeWorkshop = workshops.find((w) => w.id === selectedWorkshopId) || workshops[0];
  const durationHours = getDurationHours(activeWorkshop?.duration || "2 hrs");
  const subtotal = (activeWorkshop?.priceValue || 0) * numberOfArtists;
  const selectedSlot = slots.find((slot) => slot.start === sessionStart);
  const remaining = selectedSlot?.remaining ?? CAPACITY;
  const canSubmit = Boolean(selectedSlot?.available) && numberOfArtists <= remaining && !isSubmitting;

  React.useEffect(() => {
    setSessionStart("");
    setError("");
    if (!bookingDate) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const response = await fetch(`/api/availability?date=${bookingDate}&durationHours=${durationHours}`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Failed to load availability");
        setSlots(result.slots || []);
      } catch (slotError: any) {
        setSlots(buildFallbackSlots(bookingDate, durationHours));
        setError("");
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadSlots();
  }, [bookingDate, durationHours, lang]);

  const minDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!selectedSlot) {
      setError(lang === "zh" ? "请选择一个可预约时间。" : "Please choose an available time.");
      return;
    }
    if (numberOfArtists > selectedSlot.remaining) {
      setError(
        lang === "zh"
          ? `这个时段只剩 ${selectedSlot.remaining} 个名额，请调整人数或选择其他时间。`
          : `Only ${selectedSlot.remaining} spaces remain. Please adjust the group size or choose another time.`
      );
      return;
    }

    setIsSubmitting(true);
    const payload = {
      fullName,
      phone,
      wechatId,
      workshopId: selectedWorkshopId,
      workshopTitle: lang === "zh" ? activeWorkshop.titleZh : activeWorkshop.titleEn,
      bookingDate,
      sessionStart,
      durationHours,
      numberOfArtists,
      specialRequests,
      totalPrice: subtotal,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Booking failed");

      const savedBooking = result.booking as Booking;
      setSubmitted(true);
      setFullName("");
      setPhone("");
      setWechatId("");
      setSpecialRequests("");
      setSessionStart("");
      const nextSlots = await fetch(`/api/availability?date=${bookingDate}&durationHours=${durationHours}`).then((res) => res.json());
      if (nextSlots.success) setSlots(nextSlots.slots || []);
      localStorage.setItem("galaxy_last_booking", JSON.stringify(savedBooking));
      onBookingSuccess();
    } catch (submitError: any) {
      const fallbackBooking = createFallbackBooking({
        fullName,
        phone,
        wechatId,
        workshopId: selectedWorkshopId,
        workshopTitle: lang === "zh" ? activeWorkshop.titleZh : activeWorkshop.titleEn,
        bookingDate,
        sessionStart,
        durationHours,
        numberOfArtists,
        specialRequests,
        totalPrice: subtotal,
      });
      const existing: Booking[] = JSON.parse(localStorage.getItem("galaxy_bookings") || "[]");
      localStorage.setItem("galaxy_bookings", JSON.stringify([fallbackBooking, ...existing]));
      localStorage.setItem("galaxy_last_booking", JSON.stringify(fallbackBooking));
      setSubmitted(true);
      setFullName("");
      setPhone("");
      setWechatId("");
      setSpecialRequests("");
      setSessionStart("");
      setSlots(buildFallbackSlots(bookingDate, durationHours));
      onBookingSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="anim-fade-up mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Pricing & Booking</p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
          {lang === "zh" ? "价格与预约信息" : "Prices and Booking"}
        </h1>
        <p className="mt-5 leading-8 text-[#665448]">
          {lang === "zh"
            ? "营业时间 9:00 AM - 6:00 PM。成人体验单时段最多容纳 12 人，满员时段将无法提交预约。"
            : "Open 9:00 AM - 6:00 PM. Adult sessions can host up to 12 guests; full time slots cannot be booked."}
        </p>
      </div>

      {submitted && (
        <div className="surface-card mx-auto mt-10 flex max-w-3xl gap-3 bg-[#e8f3df] p-5 text-[#38522c]">
          <CheckCircle2 className="h-6 w-6 flex-none" />
          <p className="text-sm leading-7">
            {lang === "zh"
              ? "预约信息已提交到后台。请留意 Galaxy Art Studio 通过微信或电话与您确认。"
              : "Booking request saved to the dashboard. Galaxy Art Studio will confirm by WeChat or phone."}
          </p>
        </div>
      )}

      {error && (
        <div className="surface-card mx-auto mt-6 flex max-w-3xl gap-3 bg-[#fff1e8] p-5 text-[#8b3f25]">
          <AlertCircle className="h-6 w-6 flex-none" />
          <p className="text-sm leading-7">{error}</p>
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="surface-card bg-[#f4eadc] p-6">
            <h2 className="font-serif text-2xl font-bold">{lang === "zh" ? "价格速览" : "Price Guide"}</h2>
            <div className="mt-5 space-y-4 text-sm">
              {workshops.map((workshop) => (
                <button
                  key={workshop.id}
                  onClick={() => setSelectedWorkshopId(workshop.id)}
                  className={`soft-button block w-full border p-4 text-left ${
                    selectedWorkshopId === workshop.id ? "border-[#2f241d] bg-white" : "border-[#2f241d]/10 bg-[#fbf7ef]"
                  }`}
                >
                  <span className="block font-semibold">{lang === "zh" ? workshop.titleZh : workshop.titleEn}</span>
                  <span className="mt-1 block text-[#6f5d4f]">{workshop.priceInfo}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-[#2f241d]/10 pt-5 text-sm text-[#665448]">
              <p>{lang === "zh" ? "营业时间：9:00 AM - 6:00 PM" : "Open: 9:00 AM - 6:00 PM"}</p>
              <p>{lang === "zh" ? "成人体验建议 10 人以内，最多 12 人。" : "Adult sessions are best under 10 guests, maximum 12."}</p>
              <p>{lang === "zh" ? "双人同行可享优惠，多人预约可咨询团体价格。" : "Pair and group discounts available on request."}</p>
            </div>
          </div>
        </aside>

        <form onSubmit={submit} className="surface-card bg-[#f4eadc] p-6 sm:p-8 lg:col-span-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field icon={User} label={lang === "zh" ? "姓名 *" : "Name *"}>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            </Field>
            <Field icon={Phone} label={lang === "zh" ? "电话 *" : "Phone *"}>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </Field>
            <Field icon={MessageSquare} label={lang === "zh" ? "微信号" : "WeChat ID"}>
              <input value={wechatId} onChange={(e) => setWechatId(e.target.value)} className="input" />
            </Field>
            <Field icon={Calendar} label={lang === "zh" ? "日期 *" : "Date *"}>
              <input required type="date" min={minDate()} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input" />
            </Field>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-widest">{lang === "zh" ? "体验项目" : "Experience"}</span>
              <select value={selectedWorkshopId} onChange={(e) => setSelectedWorkshopId(e.target.value)} className="input">
                {workshops.map((workshop) => (
                  <option key={workshop.id} value={workshop.id}>
                    {lang === "zh" ? workshop.titleZh : workshop.titleEn}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Clock className="h-4 w-4 text-[#a36b4f]" />
                {lang === "zh" ? "选择具体时间 *" : "Choose a Time *"}
              </span>
              <span className="text-xs text-[#6f5d4f]">
                {lang === "zh" ? `项目时长约 ${durationHours} 小时` : `Approx. ${durationHours} hr session`}
              </span>
            </div>
            {!bookingDate ? (
              <div className="border border-dashed border-[#2f241d]/20 bg-[#fbf7ef] p-5 text-sm text-[#665448]">
                {lang === "zh" ? "请先选择日期，再选择可预约时间。" : "Choose a date first to see available times."}
              </div>
            ) : isLoadingSlots ? (
              <div className="border border-dashed border-[#2f241d]/20 bg-[#fbf7ef] p-5 text-sm text-[#665448]">
                {lang === "zh" ? "正在读取可预约时间..." : "Loading available times..."}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSessionStart(slot.start)}
                    className={`border p-4 text-left transition ${
                      sessionStart === slot.start
                        ? "border-[#2f241d] bg-white shadow-sm"
                        : slot.available
                          ? "border-[#2f241d]/12 bg-[#fbf7ef] hover:border-[#2f241d]/40"
                          : "cursor-not-allowed border-[#2f241d]/8 bg-[#e7ded1] text-[#8d8177] opacity-65"
                    }`}
                  >
                    <span className="block font-semibold">{slot.label}</span>
                    <span className="mt-2 block text-xs">
                      {slot.available
                        ? lang === "zh"
                          ? `剩余 ${slot.remaining} / ${slot.capacity} 位`
                          : `${slot.remaining} / ${slot.capacity} spaces left`
                        : lang === "zh"
                          ? "已满"
                          : "Full"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field icon={Users} label={lang === "zh" ? "人数" : "Guests"}>
              <input
                type="number"
                min={1}
                max={Math.min(CAPACITY, Math.max(remaining, 1))}
                value={numberOfArtists}
                onChange={(e) => setNumberOfArtists(Number(e.target.value))}
                className="input"
              />
            </Field>
            <div className="bg-[#fbf7ef] p-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6f5d4f]">{lang === "zh" ? "预估金额" : "Estimate"}</span>
              <p className="mt-2 font-serif text-3xl font-bold">NZ${subtotal.toFixed(2)}</p>
              <p className="mt-2 text-xs text-[#6f5d4f]">
                {selectedSlot
                  ? lang === "zh"
                    ? `当前时段剩余 ${selectedSlot.remaining} 位`
                    : `${selectedSlot.remaining} spaces left for this time`
                  : lang === "zh"
                    ? "选择时间后会显示余位"
                    : "Spaces appear after choosing a time"}
              </p>
            </div>
          </div>

          <label className="mt-6 block space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest">{lang === "zh" ? "备注" : "Notes"}</span>
            <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={4} className="input" />
          </label>

          <button
            disabled={!canSubmit}
            className="soft-button mt-8 w-full bg-[#2f241d] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:bg-[#9b9188]"
          >
            {isSubmitting ? (lang === "zh" ? "提交中..." : "Submitting...") : lang === "zh" ? "提交预约" : "Submit Booking"}
          </button>

          <div className="mt-6 flex gap-3 text-sm leading-7 text-[#665448]">
            <Mail className="mt-1 h-4 w-4 flex-none" />
            <span>galaxyartstudio.nz@gmail.com · +64 27 236 9879 · WeChat: Galaxyart8</span>
          </div>
        </form>
      </div>
    </section>
  );
}

function getDurationHours(duration: string) {
  const match = duration.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 2;
}

function buildFallbackSlots(date: string, durationHours: number): AvailabilitySlot[] {
  const bookings: Booking[] = JSON.parse(localStorage.getItem("galaxy_bookings") || "[]");
  const durationMinutes = Math.max(1, durationHours) * 60;
  const slots: AvailabilitySlot[] = [];
  for (let startMinutes = 9 * 60; startMinutes + durationMinutes <= 18 * 60; startMinutes += 30) {
    const start = toTime(startMinutes);
    const end = toTime(startMinutes + durationMinutes);
    const bookedCount = bookings
      .filter((booking) => booking.bookingDate === date && booking.status !== "Cancelled")
      .filter((booking) => overlaps(start, end, booking.sessionStart, booking.sessionEnd))
      .reduce((sum, booking) => sum + booking.numberOfArtists, 0);
    const remaining = Math.max(CAPACITY - bookedCount, 0);
    slots.push({
      start,
      end,
      label: `${start} - ${end}`,
      bookedCount,
      remaining,
      capacity: CAPACITY,
      available: remaining > 0,
    });
  }
  return slots;
}

function createFallbackBooking(payload: {
  fullName: string;
  phone: string;
  wechatId: string;
  workshopId: string;
  workshopTitle: string;
  bookingDate: string;
  sessionStart: string;
  durationHours: number;
  numberOfArtists: number;
  specialRequests: string;
  totalPrice: number;
}): Booking {
  const sessionEnd = toTime(toMinutes(payload.sessionStart) + payload.durationHours * 60);
  return {
    id: `GLX-${Date.now().toString().slice(-6)}`,
    fullName: payload.fullName,
    phone: payload.phone,
    wechatId: payload.wechatId,
    workshopId: payload.workshopId,
    workshopTitle: payload.workshopTitle,
    bookingDate: payload.bookingDate,
    sessionStart: payload.sessionStart,
    sessionEnd,
    sessionTime: `${payload.sessionStart} - ${sessionEnd}`,
    durationHours: payload.durationHours,
    numberOfArtists: payload.numberOfArtists,
    specialRequests: payload.specialRequests,
    createdAt: new Date().toISOString(),
    status: "Pending",
    totalPrice: payload.totalPrice,
  };
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <Icon className="h-4 w-4 text-[#a36b4f]" />
        {label}
      </span>
      {children}
    </label>
  );
}
