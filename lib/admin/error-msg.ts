"use client";

/**
 * Categorize Supabase/Postgres errors into clear Arabic user-facing messages.
 * Categories:
 *  - network: connection/fetch failure (no structured error from Supabase)
 *  - grant: missing table GRANT (42501 insufficient_privilege without RLS hint)
 *  - rls: row-level security blocks the operation
 *  - field: NOT NULL / missing required field (23502)
 *  - unique: duplicate key (23505)
 *  - table: table missing (42P01)
 *  - generic: anything else
 */
export type AdminErrorKind = "network" | "grant" | "rls" | "field" | "unique" | "table" | "generic";

export interface AdminErrorInfo {
  kind: AdminErrorKind;
  ar: string;
  en: string;
  raw: string;
}

export function adminErrorMessage(error: unknown): AdminErrorInfo {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const code = (error as any)?.code ?? (error as any)?.statusCode ?? "";
  const hint = (error as any)?.hint ?? "";
  const details = (error as any)?.details ?? "";
  const low = raw.toLowerCase();

  // Network / connection failures (Supabase throws on network errors)
  if (!error || (typeof error === "string" && !error.includes("code"))) {
    // If we received a plain string with no postgres code, treat as network/unknown
    if (!code && !raw.includes("violates") && !raw.includes("policy") && !raw.includes("permission")) {
      return {
        kind: "network",
        ar: "خطأ في الاتصال بالشبكة. تحقق من اتصال الإنترنت وحاول مرة أخرى.",
        en: "Network error. Check your internet connection and try again.",
        raw,
      };
    }
  }

  // 42501 insufficient_privilege
  if (code === "42501" || low.includes("insufficient_privilege") || low.includes("permission denied")) {
    // Distinguish RLS vs GRANT: RLS usually mentions "policy" or "row-level security"
    if (low.includes("policy") || low.includes("row-level security") || low.includes("rls")) {
      return {
        kind: "rls",
        ar: "سياسة RLS تمنع هذه العملية. تأكد من إضافة حسابك كمسؤول (public.admins) ومن تطبيق سياسات RLS.",
        en: "RLS policy blocks this operation. Make sure your account is added to public.admins and RLS policies are applied.",
        raw,
      };
    }
    return {
      kind: "grant",
      ar: "لا توجد صلاحية تسجيل/تعديل على هذا الجدول (GRANT ناقص). تواصل مع responsable قواعد البيانات.",
      en: "Missing table GRANT for insert/update/delete. Contact the database administrator.",
      raw,
    };
  }

  // NOT NULL / missing field
  if (code === "23502" || low.includes("not_null_violation") || low.includes("null value")) {
    return {
      kind: "field",
      ar: "حقل مطلوب ناقص. تأكد من تعبئة جميع الحقول الإلزامية قبل الحفظ.",
      en: "A required field is missing. Fill in all required fields before saving.",
      raw,
    };
  }

  // Unique violation
  if (code === "23505" || low.includes("unique_violation") || low.includes("duplicate")) {
    return {
      kind: "unique",
      ar: "قيمة مكررة. هذا السجل موجود مسبقًا (مثل slug أو عنوان مكرر).",
      en: "Duplicate value. This record already exists (e.g. slug or title).",
      raw,
    };
  }

  // Table missing
  if (code === "42P01" || low.includes("undefined_table") || low.includes("relation") && low.includes("does not exist")) {
    return {
      kind: "table",
      ar: "الجدول غير موجود. تأكد من تطبيق migration Supabase (001_init.sql onward).",
      en: "Table not found. Apply the Supabase migration (001_init.sql onward).",
      raw,
    };
  }

  // Generic fallback
  return {
    kind: "generic",
    ar: "خطأ في الحفظ: " + raw,
    en: "Save error: " + raw,
    raw,
  };
}
