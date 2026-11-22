import type { Localized } from "@/lib/i18n";

export type ShowcaseVideo = {
  id: string;
  title: Localized;
  /** رابط الفيديو (mp4/ويب) أو رابط خارجي. اتركه فارغًا لإخفاء العنصر حتى يتوفر مصدر. */
  url?: string;
  thumbnail?: string;
  duration?: string;
  category?: Localized;
};

/**
 * فيديوهات غرفة العرض (أعمال رَواج).
 * لا تُضاف فيديوهات أو ادعاءات غير موثقة. عند توفر ملفات/روابط حقيقية أضفها هنا.
 */
export const showcaseVideos: ShowcaseVideo[] = [];