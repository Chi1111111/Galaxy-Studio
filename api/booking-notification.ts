interface BookingEmailPayload {
  id?: string;
  fullName: string;
  phone: string;
  wechatId?: string;
  workshopTitle: string;
  bookingDate: string;
  sessionStart: string;
  sessionEnd?: string;
  numberOfArtists: number;
  specialRequests?: string;
  totalPrice: number;
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const row = (label: string, value: unknown) => `
  <tr>
    <td style="padding:10px 12px;color:#756356;border-bottom:1px solid #eadfce;width:120px;">${label}</td>
    <td style="padding:10px 12px;color:#2f241d;border-bottom:1px solid #eadfce;font-weight:600;">${escapeHtml(value || "-")}</td>
  </tr>`;

async function sendBookingNotification(booking: BookingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  const recipient = process.env.BOOKING_NOTIFICATION_EMAIL || "galaxyartstudio.nz@gmail.com";
  const sender = process.env.BOOKING_FROM_EMAIL || "Galaxy Art Studio Booking <onboarding@resend.dev>";
  const sessionTime = booking.sessionEnd ? `${booking.sessionStart} - ${booking.sessionEnd}` : booking.sessionStart;
  const html = `<!doctype html><html><body style="margin:0;background:#f7f2ea;font-family:Arial,'Microsoft YaHei',sans-serif;color:#2f241d;">
    <div style="max-width:640px;margin:0 auto;padding:32px 18px;"><div style="background:#fff;border:1px solid #e3d6c4;padding:28px;">
      <p style="margin:0 0 8px;color:#a36b4f;font-size:12px;font-weight:700;letter-spacing:2px;">GALAXY ART STUDIO</p>
      <h1 style="margin:0 0 10px;font-family:Georgia,serif;font-size:28px;">收到新的预约</h1>
      <p style="margin:0 0 24px;color:#756356;line-height:1.7;">请登录预约后台确认时间，并通过电话或微信联系客人。</p>
      <table style="width:100%;border-collapse:collapse;background:#fbf7ef;font-size:14px;">
        ${row("预约编号", booking.id)}${row("客人姓名", booking.fullName)}${row("联系电话", booking.phone)}
        ${row("微信", booking.wechatId)}${row("体验项目", booking.workshopTitle)}${row("预约日期", booking.bookingDate)}
        ${row("预约时间", sessionTime)}${row("预约人数", `${booking.numberOfArtists} 人`)}
        ${row("预计金额", `NZ$${Number(booking.totalPrice || 0).toFixed(2)}`)}${row("客人备注", booking.specialRequests)}
      </table>
      <p style="margin:24px 0 0;color:#8a786b;font-size:12px;line-height:1.7;">这封邮件由 Galaxy Art Studio 网站预约系统自动发送。</p>
    </div></div></body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `booking-${booking.id || `${booking.bookingDate}-${booking.phone}-${booking.sessionStart}`}`,
    },
    body: JSON.stringify({
      from: sender,
      to: recipient,
      subject: `New booking: ${booking.bookingDate} ${booking.fullName}`,
      html,
    }),
  });
  const result = (await response.json()) as { id?: string; message?: string };
  if (!response.ok) throw new Error(result.message || "Resend rejected the email");
  return result;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const booking = (req.body || {}) as Partial<BookingEmailPayload>;
  if (
    !booking.fullName ||
    !booking.phone ||
    !booking.workshopTitle ||
    !booking.bookingDate ||
    !booking.sessionStart ||
    !booking.numberOfArtists
  ) {
    return res.status(400).json({ success: false, error: "Missing required booking fields" });
  }

  try {
    const data = await sendBookingNotification(booking as BookingEmailPayload);
    return res.status(200).json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Booking notification email failed:", error);
    return res.status(500).json({ success: false, error: "Unable to send booking notification" });
  }
}
