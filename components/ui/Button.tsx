import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "./Arrows";
import type { Locale } from "@/lib/i18n";

type Variant = "accent" | "brand" | "dark" | "outline" | "ghost-dark";

const variantClass: Record<Variant, string> = {
  accent: "btn-accent",
  brand: "btn-brand",
  dark: "btn-dark",
  outline: "btn-outline",
  "ghost-dark": "btn-ghost-dark",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  locale?: Locale;
};

type LinkButtonProps = BaseProps & {
  href: string;
  external?: boolean;
};

export function ButtonLink({
  children,
  href,
  variant = "accent",
  withArrow,
  className,
  locale = "ar",
  external,
}: LinkButtonProps) {
  const classes = cn(variantClass[variant], "group", className);
  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <Arrow
          locale={locale}
          className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        />
      ) : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

type ButtonProps = BaseProps & ComponentProps<"button">;

export function Button({
  children,
  variant = "accent",
  withArrow,
  className,
  locale = "ar",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(variantClass[variant], "group", className)} {...props}>
      <span>{children}</span>
      {withArrow ? (
        <Arrow
          locale={locale}
          className="transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
        />
      ) : null}
    </button>
  );
}
