/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workshop {
  id: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  priceInfo: string;
  priceValue: number; // Base price
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Easy for Kids" | "All Levels";
  category: "painting" | "mirror" | "scent" | "crafts";
  imageUrl: string;
  highlightsEn: string[];
  highlightsZh: string[];
}

export interface Booking {
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
  status: "Pending" | "Confirmed" | "Cancelled";
  totalPrice: number;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  label: string;
  bookedCount: number;
  remaining: number;
  capacity: number;
  available: boolean;
}

export interface AiInspirationResponse {
  conceptNameEn: string;
  conceptNameZh: string;
  descriptionEn: string;
  descriptionZh: string;
  suggestedColors: { name: string; hex: string }[];
  stepsEn: string[];
  stepsZh: string[];
  imagePrompt: string;
}
