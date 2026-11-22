import Image from "next/image";
import { Gamepad2, Plus, Sparkles } from "lucide-react";
import { pick, type Locale } from "@/lib/i18n";
import { teamSlots, type Member } from "@/content/team";
import { cn } from "@/lib/utils";

export function TeamGrid({
  members,
  locale,
  className,
  columns = 4,
  showSlot = false,
}: {
  members: Member[];
  locale: Locale;
  className?: string;
  columns?: 3 | 4;
  showSlot?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        className,
      )}
    >
      {members.map((member, index) => (
        <article
          key={member.slug}
          className="group relative overflow-hidden rounded-3xl border border-line bg-surface/70 p-3 transition duration-500 hover:-translate-y-1 hover:border-brand-400/45"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-deep">
            {member.image ? (
              <Image
                src={member.image}
                alt={pick(member.name, locale)}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                className="object-cover grayscale-[35%] transition duration-700 ease-smooth group-hover:scale-[1.03] group-hover:grayscale-0"
              />
            ) : (
              <div className="arcade-grid flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/25 via-deep to-abyss">
                <span className="font-pixel text-[38px] text-accent/90">
                  {pick(member.name, locale).slice(0, 1)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-transparent opacity-90" />
            <span className="pixel-label absolute start-3 top-3 rounded-md bg-abyss/80 px-2 py-1 text-[8px] text-accent backdrop-blur">
              PLAYER {String(index + 1).padStart(2, "0")}
            </span>
            <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-abyss/80 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-accent backdrop-blur">
              <Sparkles className="h-2.5 w-2.5" />
              LVL {String(member.level).padStart(2, "0")}
            </span>

            <div className="absolute inset-x-3 bottom-3">
              <h3 className="text-[17px] font-extrabold text-white">
                {pick(member.name, locale)}
              </h3>
              <p className="mt-0.5 text-[11.5px] font-semibold text-brand-200">
                {pick(member.role, locale)}
              </p>
            </div>
          </div>

          <div className="px-2 pb-1 pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink/50">
              <Gamepad2 className="h-3 w-3 text-brand-300" />
              {pick(member.classTag, locale)}
            </span>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink/45">
              {pick(member.bio, locale)}
            </p>
          </div>
        </article>
      ))}

      {showSlot ? (
        <article className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white/[0.015] p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/[0.03] text-ink/30">
            <Plus className="h-5 w-5" />
          </span>
          <p className="mt-4 text-[15px] font-extrabold text-ink/70">{pick(teamSlots.title, locale)}</p>
          <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-ink/35">
            {pick(teamSlots.body, locale)}
          </p>
        </article>
      ) : null}
    </div>
  );
}
