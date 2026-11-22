import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  label: string;
  title: string;
  body?: string;
  tone?: "dark" | "light";
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  label,
  title,
  body,
  tone = "dark",
  align = "start",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <Reveal>
        <span className={cn("eyebrow", !isDark && "eyebrow-dark")}>{label}</span>
      </Reveal>
      <Reveal delay={0.06}>
        <h2
          className={cn(
            "mt-5 text-display-sm",
            isDark ? "text-ink" : "text-white",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </Reveal>
      {body ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              "mt-5 text-[17px] leading-relaxed",
              isDark ? "text-ink/60" : "text-white/65",
              align === "center" && "mx-auto max-w-2xl",
            )}
          >
            {body}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
