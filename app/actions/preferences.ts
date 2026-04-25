"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updatePreferences(formData: FormData) {
  const role = formData.get("role") as string;
  const skill = formData.get("skill") as string;
  const location = formData.get("location") as string;

  if (!role || !skill || !location) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("user_roles")
    .update({ role, skill, location })
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  return { success: true };
}
