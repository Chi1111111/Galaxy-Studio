/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();
const ADULT_CAPACITY = 12;
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 18 * 60;
const SLOT_STEP_MINUTES = 30;
const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

app.use(express.json());

type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

interface StoredBooking {
  id: string;
  fullName: string;
  phone: string;
  wechatId?: string;
  workshopId: string;
  workshopTitle: string;
  bookingDate: string;
  sessionTime: string;
  sessionStart: string;
  sessionEnd: string;
  durationHours: number;
  numberOfArtists: number;
  specialRequests?: string;
  createdAt: string;
  status: BookingStatus;
  totalPrice: number;
}

const ensureBookingStore = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
};

const readBookings = async (): Promise<StoredBooking[]> => {
  await ensureBookingStore();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeBookings = async (bookings: StoredBooking[]) => {
  await ensureBookingStore();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const formatSlot = (start: string, end: string) => `${start} - ${end}`;

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
  toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);

const getBookedCount = (bookings: StoredBooking[], date: string, start: string, end: string) =>
  bookings
    .filter((booking) => booking.bookingDate === date && booking.status !== "Cancelled")
    .filter((booking) => overlaps(start, end, booking.sessionStart, booking.sessionEnd))
    .reduce((sum, booking) => sum + booking.numberOfArtists, 0);

const buildAvailability = (bookings: StoredBooking[], date: string, durationHours: number) => {
  const durationMinutes = Math.max(1, durationHours) * 60;
  const slots = [];
  for (let startMinutes = OPEN_MINUTES; startMinutes + durationMinutes <= CLOSE_MINUTES; startMinutes += SLOT_STEP_MINUTES) {
    const start = toTime(startMinutes);
    const end = toTime(startMinutes + durationMinutes);
    const bookedCount = getBookedCount(bookings, date, start, end);
    const remaining = Math.max(ADULT_CAPACITY - bookedCount, 0);
    slots.push({
      start,
      end,
      label: formatSlot(start, end),
      bookedCount,
      remaining,
      capacity: ADULT_CAPACITY,
      available: remaining > 0,
    });
  }
  return slots;
};

app.get("/api/bookings", async (_req, res) => {
  try {
    const bookings = await readBookings();
    return res.json({ success: true, bookings });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to read bookings" });
  }
});

app.get("/api/availability", async (req, res) => {
  const date = String(req.query.date || "");
  const durationHours = Number(req.query.durationHours || 2);
  if (!date) return res.status(400).json({ success: false, error: "Date is required" });

  try {
    const bookings = await readBookings();
    return res.json({
      success: true,
      capacity: ADULT_CAPACITY,
      openTime: "09:00",
      closeTime: "18:00",
      slots: buildAvailability(bookings, date, durationHours),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to load availability" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const payload = req.body || {};
  const start = String(payload.sessionStart || "");
  const durationHours = Number(payload.durationHours || 2);
  const end = toTime(toMinutes(start) + Math.max(1, durationHours) * 60);
  const numberOfArtists = Number(payload.numberOfArtists || 1);

  if (!payload.fullName || !payload.phone || !payload.bookingDate || !payload.workshopId || !start) {
    return res.status(400).json({ success: false, error: "Missing required booking fields" });
  }
  if (toMinutes(start) < OPEN_MINUTES || toMinutes(end) > CLOSE_MINUTES) {
    return res.status(400).json({ success: false, error: "Selected time is outside business hours" });
  }
  if (numberOfArtists < 1 || numberOfArtists > ADULT_CAPACITY) {
    return res.status(400).json({ success: false, error: `Group size must be between 1 and ${ADULT_CAPACITY}` });
  }

  try {
    const bookings = await readBookings();
    const bookedCount = getBookedCount(bookings, payload.bookingDate, start, end);
    const remaining = ADULT_CAPACITY - bookedCount;
    if (numberOfArtists > remaining) {
      return res.status(409).json({
        success: false,
        error: `Only ${Math.max(remaining, 0)} spaces remain for this time slot`,
        remaining: Math.max(remaining, 0),
      });
    }

    const booking: StoredBooking = {
      id: `GLX-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      fullName: String(payload.fullName),
      phone: String(payload.phone),
      wechatId: payload.wechatId ? String(payload.wechatId) : "",
      workshopId: String(payload.workshopId),
      workshopTitle: String(payload.workshopTitle || payload.workshopId),
      bookingDate: String(payload.bookingDate),
      sessionTime: formatSlot(start, end),
      sessionStart: start,
      sessionEnd: end,
      durationHours,
      numberOfArtists,
      specialRequests: payload.specialRequests ? String(payload.specialRequests) : "",
      createdAt: new Date().toISOString(),
      status: "Pending",
      totalPrice: Number(payload.totalPrice || 0),
    };

    await writeBookings([booking, ...bookings]);
    return res.status(201).json({ success: true, booking });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to save booking" });
  }
});

app.patch("/api/bookings/:id", async (req, res) => {
  const nextStatus = String(req.body?.status || "") as BookingStatus;
  if (!["Pending", "Confirmed", "Cancelled"].includes(nextStatus)) {
    return res.status(400).json({ success: false, error: "Invalid booking status" });
  }

  try {
    const bookings = await readBookings();
    const index = bookings.findIndex((booking) => booking.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, error: "Booking not found" });
    bookings[index] = { ...bookings[index], status: nextStatus };
    await writeBookings(bookings);
    return res.json({ success: true, booking: bookings[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update booking" });
  }
});

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Offline fallbacks will be used.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API route for Art concept generator
app.post("/api/gemini/generate-concept", async (req, res) => {
  const { prompt, style, mood, lang } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      success: false,
      error: "API key is not configured inside your AI Studio Secrets panel. Running in offline backup mode.",
    });
  }

  try {
    const aiPrompt = `
      You are an expert design assistant for "Galaxy Art Studio", Newmarket, Auckland.
      We design luxury handcraft sessions (painting, mirror arts, soy clay, fluid casting) for adult beginners to relax and recharge.
      The customer has specified these preferences:
      - Prompt (their idea): "${prompt}"
      - Selected Handcraft Style: "${style}"
      - Selected Palette Mood Tones: "${mood}"
      
      Generate a bespoke creative art session custom recipe in both Chinese and English, keeping it highly inspiring, therapeutic, and beautiful.
      You must strictly provide your response in the specified JSON schema structure.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: aiPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptNameEn: {
              type: Type.STRING,
              description: "A gorgeous, poetic english title for the painting session.",
            },
            conceptNameZh: {
              type: Type.STRING,
              description: "A highly elegant, poetic Chinese translation/localized title.",
            },
            descriptionEn: {
              type: Type.STRING,
              description: "A warm, inspiring 3-sentence description of the concept and how it fits the selected craft medium and mood in English.",
            },
            descriptionZh: {
              type: Type.STRING,
              description: "A highly artistic, soothing Chinese localization of the concept description.",
            },
            suggestedColors: {
              type: Type.ARRAY,
              description: "4 curated paint colors that matches the specified mood.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Color name (e.g. Lavender Mist / 极光紫色)." },
                  hex: { type: Type.STRING, description: "The hexadecimal color code (e.g. #A855F7)." }
                },
                required: ["name", "hex"]
              }
            },
            stepsEn: {
              type: Type.ARRAY,
              description: "4 simple, tactile milestones (20 words each) for painting/crafting it in English.",
              items: { type: Type.STRING }
            },
            stepsZh: {
              type: Type.ARRAY,
              description: "4 clear and step-by-step guidance milestones in Chinese.",
              items: { type: Type.STRING }
            },
            imagePrompt: {
              type: Type.STRING,
              description: "A professional image generation prompt representing this artwork and style.",
            }
          },
          required: [
            "conceptNameEn",
            "conceptNameZh",
            "descriptionEn",
            "descriptionZh",
            "suggestedColors",
            "stepsEn",
            "stepsZh",
            "imagePrompt"
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response returned from Gemini API");
    }

    const parsedData = JSON.parse(textOutput.trim());
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Gemini API error during content generation:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal error occurred call to Gemini" });
  }
});

// Vite Middleware for development vs Express static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Galaxy Art Server] listening securely on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
