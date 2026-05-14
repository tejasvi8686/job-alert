"use server";

import { createClient } from "@/lib/supabase-server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function deleteAccount() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return { error: "Unauthorized" };
  }

  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const userId = claims.sub as string;

  // Delete from optional tables (may not exist)
  try {
    await serviceClient.from("job_feedback").delete().eq("user_id", userId);
  } catch {
    // Table may not exist — continue
  }

  try {
    await serviceClient.from("saved_jobs").delete().eq("user_id", userId);
  } catch {
    // Table may not exist — continue
  }

  // Delete from core tables
  const { error: historyError } = await serviceClient
    .from("job_alert_history")
    .delete()
    .eq("user_id", userId);

  if (historyError) {
    return { error: historyError.message };
  }

  const { error: rolesError } = await serviceClient
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (rolesError) {
    return { error: rolesError.message };
  }

  // Delete the auth user
  const { error: deleteUserError } =
    await serviceClient.auth.admin.deleteUser(userId);

  if (deleteUserError) {
    return { error: deleteUserError.message };
  }

  // Sign out the user-scoped client
  await supabase.auth.signOut();

  return { success: true };
}
