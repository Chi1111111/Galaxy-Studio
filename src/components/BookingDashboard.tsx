import React from "react";
import { CalendarDays, CheckCircle2, Clock, RefreshCw, Users } from "lucide-react";
import { Booking } from "../types";

interface BookingDashboardProps {
  lang: "zh" | "en";
  setActiveTab: (tab: string) => void;
}

const CAPACITY = 12;

export default function BookingDashboard({ lang, setActiveTab }: BookingDashboardProps) {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const days = React.useMemo(() => buildDayRange(4), []);

  const loadBookings = React.useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/bookings");
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to load bookings");
      setBookings(result.bookings || []);
    } catch {
      const localBookings: Booking[] = JSON.parse(localStorage.getItem("galaxy_bookings") || "[]");
      setBookings(localBookings);
      setError("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (bookingId: string, status: Booking["status"]) => {
    setError("");
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to update booking");
      setBookings((items) => items.map((booking) => (booking.id === bookingId ? result.booking : booking)));
    } catch {
      setBookings((items) => {
        const nextItems = items.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking));
        localStorage.setItem("galaxy_bookings", JSON.stringify(nextItems));
        return nextItems;
      });
      setError("");
    }
  };

  const upcomingBookings = bookings.filter((booking) => days.some((day) => day.date === booking.bookingDate));
  const upcomingGuests = upcomingBookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + booking.numberOfArtists, 0);
  const activeDayCount = days.filter((day) => getBookingsForDate(bookings, day.date).length > 0).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">Booking Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{lang === "zh" ? "预约后台" : "Booking Dashboard"}</h1>
          <p className="mt-4 max-w-2xl leading-8 text-[#665448]">
            {lang === "zh"
              ? "默认显示从今天开始连续 4 天的预约、人数容量与确认状态。取消的预约不会占用时段容量。"
              : "Shows today and the next 3 days by default, including bookings, capacity, and confirmation status."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="soft-button border border-[#2f241d]/20 px-5 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setActiveTab("booking")}>
            {lang === "zh" ? "返回预约页" : "Back to Booking"}
          </button>
          <button className="soft-button inline-flex items-center gap-2 bg-[#2f241d] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white" onClick={loadBookings}>
            <RefreshCw className="h-4 w-4" />
            {lang === "zh" ? "刷新" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <MetricCard icon={CalendarDays} label={lang === "zh" ? "查看范围" : "Date Range"} value={lang === "zh" ? "未来 4 天" : "Next 4 Days"} />
        <MetricCard icon={Users} label={lang === "zh" ? "4 天预约人数" : "Guests Booked"} value={`${upcomingGuests}`} />
        <MetricCard icon={Clock} label={lang === "zh" ? "有预约天数" : "Booked Days"} value={`${activeDayCount} / 4`} />
      </div>

      {error && <div className="surface-card mt-6 bg-[#fff1e8] p-5 text-sm text-[#8b3f25]">{error}</div>}

      <div className="mt-8 space-y-8">
        {days.map((day) => {
          const dayBookings = getBookingsForDate(bookings, day.date);
          return (
            <div key={day.date}>
              <DayPanel
                day={day}
                bookings={dayBookings}
                lang={lang}
                isLoading={isLoading}
                onUpdateStatus={updateStatus}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DayPanel({
  day,
  bookings,
  lang,
  isLoading,
  onUpdateStatus,
}: {
  day: AdminDay;
  bookings: Booking[];
  lang: "zh" | "en";
  isLoading: boolean;
  onUpdateStatus: (bookingId: string, status: Booking["status"]) => void;
}) {
  const totalGuests = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((sum, booking) => sum + booking.numberOfArtists, 0);
  const slotSummary = buildSlotSummary(bookings);

  return (
    <section className="surface-card overflow-hidden bg-[#f4eadc]">
      <div className="grid gap-5 border-b border-[#2f241d]/10 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a36b4f]">{day.badge}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold">{day.label}</h2>
          <p className="mt-1 text-sm text-[#665448]">{day.date}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <MiniMetric label={lang === "zh" ? "预约" : "Bookings"} value={`${bookings.length}`} />
          <MiniMetric label={lang === "zh" ? "人数" : "Guests"} value={`${totalGuests}`} />
          <MiniMetric label={lang === "zh" ? "容量" : "Capacity"} value={`12 / ${lang === "zh" ? "时段" : "slot"}`} />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-12">
        <aside className="border-b border-[#2f241d]/10 p-6 lg:col-span-4 lg:border-b-0 lg:border-r">
          <h3 className="font-serif text-2xl font-bold">{lang === "zh" ? "时段容量" : "Capacity by Time"}</h3>
          <div className="mt-5 space-y-3">
            {slotSummary.length ? (
              slotSummary.map((slot) => (
                <div key={slot.label} className="bg-[#fbf7ef] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">{slot.label}</span>
                    <span className={slot.count >= CAPACITY ? "text-sm font-bold text-[#9b3526]" : "text-sm text-[#5b4a3f]"}>
                      {slot.count}/{CAPACITY}
                    </span>
                  </div>
                  <div className="mt-3 h-2 bg-[#e4d8c8]">
                    <div className="h-full bg-[#2f241d]" style={{ width: `${Math.min((slot.count / CAPACITY) * 100, 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-[#665448]">{lang === "zh" ? "这一天还没有预约。" : "No bookings for this date."}</p>
            )}
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[#2f241d]/10 p-6">
            <h3 className="font-serif text-2xl font-bold">{lang === "zh" ? "预约记录" : "Bookings"}</h3>
            {isLoading && <span className="text-xs text-[#665448]">{lang === "zh" ? "读取中..." : "Loading..."}</span>}
          </div>
          <div className="divide-y divide-[#2f241d]/10">
            {bookings.length ? (
              bookings.map((booking) => (
                <div key={booking.id}>
                  <BookingRow booking={booking} lang={lang} onUpdateStatus={onUpdateStatus} />
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm leading-7 text-[#665448]">
                {lang === "zh" ? "这一天暂无预约记录。" : "No bookings for this date."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingRow({
  booking,
  lang,
  onUpdateStatus,
}: {
  booking: Booking;
  lang: "zh" | "en";
  onUpdateStatus: (bookingId: string, status: Booking["status"]) => void;
}) {
  return (
    <article className="grid gap-5 p-6 md:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-serif text-xl font-bold">{booking.fullName}</h3>
          <StatusBadge status={booking.status} />
        </div>
        <div className="mt-3 grid gap-2 text-sm leading-7 text-[#5b4a3f] sm:grid-cols-2">
          <p>{booking.workshopTitle}</p>
          <p>{booking.sessionTime}</p>
          <p>{lang === "zh" ? "人数" : "Guests"}: {booking.numberOfArtists}</p>
          <p>NZ${booking.totalPrice.toFixed(2)}</p>
          <p>{lang === "zh" ? "电话" : "Phone"}: {booking.phone}</p>
          <p>WeChat: {booking.wechatId || "-"}</p>
        </div>
        {booking.specialRequests && <p className="mt-3 bg-[#fbf7ef] p-3 text-sm leading-7 text-[#665448]">{booking.specialRequests}</p>}
      </div>
      <div className="flex min-w-36 flex-col gap-2">
        <button className="soft-button bg-[#2f241d] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white" onClick={() => onUpdateStatus(booking.id, "Confirmed")}>
          {lang === "zh" ? "确认" : "Confirm"}
        </button>
        <button className="soft-button border border-[#2f241d]/20 px-4 py-2 text-xs font-bold uppercase tracking-widest" onClick={() => onUpdateStatus(booking.id, "Pending")}>
          {lang === "zh" ? "待确认" : "Pending"}
        </button>
        <button className="soft-button bg-[#9b3526] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white" onClick={() => onUpdateStatus(booking.id, "Cancelled")}>
          {lang === "zh" ? "取消" : "Cancel"}
        </button>
      </div>
    </article>
  );
}

interface AdminDay {
  date: string;
  label: string;
  badge: string;
}

function buildDayRange(count: number): AdminDay[] {
  const formatter = new Intl.DateTimeFormat("zh-NZ", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      date: toDateInputValue(date),
      label: formatter.format(date),
      badge: index === 0 ? "Today" : index === 1 ? "Tomorrow" : `Day ${index + 1}`,
    };
  });
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getBookingsForDate(bookings: Booking[], date: string) {
  return bookings
    .filter((booking) => booking.bookingDate === date)
    .sort((a, b) => `${a.sessionStart}${a.createdAt}`.localeCompare(`${b.sessionStart}${b.createdAt}`));
}

function buildSlotSummary(bookings: Booking[]) {
  const summary = new Map<string, number>();
  bookings
    .filter((booking) => booking.status !== "Cancelled")
    .forEach((booking) => {
      summary.set(booking.sessionTime, (summary.get(booking.sessionTime) || 0) + booking.numberOfArtists);
    });
  return Array.from(summary.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="surface-card bg-[#f4eadc] p-5">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6f5d4f]">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <p className="mt-3 font-serif text-3xl font-bold">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-28 bg-[#fbf7ef] p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[#6f5d4f]">{label}</p>
      <p className="mt-2 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const className =
    status === "Confirmed"
      ? "bg-[#e8f3df] text-[#38522c]"
      : status === "Cancelled"
        ? "bg-[#f5ded6] text-[#9b3526]"
        : "bg-[#fff5d8] text-[#71521a]";
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-widest ${className}`}>
      {status === "Confirmed" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}
