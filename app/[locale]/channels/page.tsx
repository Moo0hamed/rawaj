import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { ChannelCard } from "@/components/channels/ChannelCard";
import { RefreshButton } from "@/components/channels/RefreshButton";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { fetchPublishedChannelsClient } from "@/lib/cms/public-client";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const d = dict as any;
  return {
    title: d.channelsPage?.label || (locale === "ar" ? "غرفة الحسابات" : "Channels Room"),
    description: d.channelsPage?.body || "",
    alternates: {
      canonical: `/${locale}/channels`,
      languages: { ar: "/ar/channels", en: "/en/channels" },
    },
  };
}

export default async function ChannelsPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const channels = await fetchPublishedChannelsClient();

  const d = dict as any;
  const label = d.channelsPage?.label || (locale === "ar" ? "غرفة الحسابات" : "Channels Room");
  const title = d.channelsPage?.title || (locale === "ar" ? "القنوات والصفحات التي نديرها" : "Channels & pages we manage");
  const body = d.channelsPage?.body || (locale === "ar" ? "بطاقات تعريف بالقنوات والصفحات، بآخر الإحصائيات وتحديث تلقائي كل 24 ساعة." : "Channel & page cards with latest stats and auto-refresh every 24h.");

  return (
    <>
      <PageHero
        locale={locale}
        label={label}
        title={title}
        body={body}
        crumbs={[{ label: "Channels" }]}
      />

      <section className="section bg-surface">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[13px] font-semibold text-ink/60">{locale === "ar" ? `${channels.length} قناة/صفحة` : `${channels.length} channel(s)`}</p>
              <p className="text-[12px] text-ink/40">{locale === "ar" ? "آخر تحديث تلقائي: كل 24 ساعة" : "Auto-refreshed every 24h"}</p>
            </div>
            <RefreshButton locale={locale} />
          </div>

          {channels.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-400/30 bg-brand-500/[0.04] p-8 text-center">
              <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-brand-200">COMING SOON</p>
              <h3 className="mt-2 text-[22px] font-black text-ink">{locale === "ar" ? "لا توجد قنوات بعد" : "No channels yet"}</h3>
              <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-ink/55">{locale === "ar" ? "ستظهر القنوات هنا عند إضافتها من لوحة التحكم." : "Channels will appear here when added from admin."}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}