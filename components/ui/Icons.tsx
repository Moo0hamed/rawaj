import {
  Camera,
  Clapperboard,
  Megaphone,
  Palette,
  Share2,
  Target,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  Shirt,
  Cpu,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon as ServiceIconName } from "@/content/services";
import type { Industry } from "@/content/industries";

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  strategy: Target,
  social: Share2,
  content: Clapperboard,
  camera: Camera,
  brand: Palette,
  megaphone: Megaphone,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconName;
  className?: string;
}) {
  const Icon = serviceIcons[name];
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}

const industryIcons: Record<Industry["icon"], LucideIcon> = {
  food: UtensilsCrossed,
  health: Stethoscope,
  realestate: Building2,
  fashion: Shirt,
  tech: Cpu,
  education: GraduationCap,
};

export function IndustryIcon({
  name,
  className,
}: {
  name: Industry["icon"];
  className?: string;
}) {
  const Icon = industryIcons[name];
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
