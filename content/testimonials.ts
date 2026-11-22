import type { Localized } from "@/lib/i18n";

export type Testimonial = {
  id: string;
  quote: Localized;
  name: Localized;
  role: Localized;
  rating: number;
  initials: string;
};

/** لا شهادات معروضة كحقيقية حتى تتوفر موافقات موثقة. */
export const testimonials: Testimonial[] = [];