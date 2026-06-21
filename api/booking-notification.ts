import type { BookingEmailPayload } from "../src/server/bookingEmail";
import { sendBookingNotification } from "../src/server/bookingEmail";

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
