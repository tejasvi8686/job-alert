import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, role, skill, location } = body;

  if (!email || !role || !skill || !location) {
    return Response.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_roles")
    .insert({ email, role, skill, location, user_id: user.id });

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
