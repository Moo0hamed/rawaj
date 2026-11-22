import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSetupClient from "./SetupClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminSetupPage() {
  const supabase = await createClient();
  if (supabase) {
    try {
      const { data: hasOwner, error } = await supabase.rpc("has_owner");
      if (!error && hasOwner === true) redirect("/admin");
      // fallback for older DB without has_owner
      if (error) {
        const { data: admins } = await supabase.from("admins").select("user_id").limit(1);
        if (admins && admins.length > 0) redirect("/admin");
      }
    } catch {
      // if check fails unexpectedly, do not expose setup; dashboard layout still enforces auth/owner
      redirect("/admin");
    }
  }
  return <AdminSetupClient />;
}