import Link from "next/link";
import { Gamepad2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { TrapsSection } from "@/components/game/traps/Traps";
import { games } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";

export function PlayTeaser({ locale }: { locale: Locale }) {
  const preview = games.slice(0, 4);
  return (
    <section className="section bg-abyss">
      <div className="shell">
        <div className="panel arcade-grid relative overflow-hidden p-6 sm:p-10">
          <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-[80px]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="pixel-label">{locale === "ar" ? "استراحة اللاعبين" : "PLAYER LOUNGE"}</p>
              <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)] font-black leading-tight text-white">
                {locale === "ar" ? "الموقع ده فيه ألعاب… بجد." : "This site has games… seriously."}
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink/50">
                {locale === "ar"
                  ? "10 ألعاب مصغّرة و4 مقالب خفيفة، بنفس روح الشغل اللي بنعمله: تفاصيل، ملاحظة، ومزاج. اجمع XP وارتقِ المستويات — من غير تسجيل."
                  : "10 mini-games and 4 light pranks, with the same spirit as our work: detail, observation, and mood. Collect XP and level up — no signup."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {preview.map((game) => (
                  <span key={game.id} className="hud-chip">
                    {pick(game.title, locale)}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-ink/35">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-accent" />
                  {locale === "ar" ? "حتى 380 XP" : "up to 380 XP"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-300" />
                  {locale === "ar" ? "آمنة وبدون بيانات" : "Safe, no data"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                  {locale === "ar" ? "محفوظ على جهازك" : "Saved on your device"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-onAccent">
                <Gamepad2 className="h-6 w-6" />
              </span>
              <p className="mt-3 text-[15px] font-extrabold text-white">
                {locale === "ar" ? "ادخل الأركيد" : "Enter the arcade"}
              </p>
              <p className="mt-1 text-[11.5px] text-ink/45">
                {locale === "ar" ? "دقيقتين كفاية تغيّر مزاجك." : "Two minutes is enough to change your mood."}
              </p>
              <Link href={`/${locale}/play`} className="btn-accent mt-4 w-full !py-3 text-[13px]">
                {locale === "ar" ? "ابدأ اللعب" : "Start playing"}
              </Link>
              <p className="mt-2 text-[10px] text-ink/30">
                {locale === "ar" ? "بدون تسجيل · بدون إعلانات" : "No signup · No ads"}
              </p>
            </div>
          </div>

          <div className="relative mt-8 border-t border-line pt-6">
            <p className="mb-4 flex items-center gap-2 text-[12.5px] font-extrabold text-ink/60">
              <Sparkles className="h-4 w-4 text-accent" />
              {locale === "ar" ? "4 مقالب خفيفة… مكتوب عليها إنها مقالب" : "4 light pranks… clearly labeled"}
            </p>
            <TrapsSection locale={locale} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
