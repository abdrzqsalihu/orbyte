import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    
    //  Get current session to verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require fresh re-authentication (within 5 minutes)
    const lastSignIn = new Date(user.last_sign_in_at || 0).getTime();
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - lastSignIn > fiveMinutes) {
      return NextResponse.json(
        { error: "Recent login required. Please sign in again to delete your account." },
        { status: 403 }
      );
    }

    //  Use Admin Client to delete the user from Supabase Auth
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting user with admin client:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    //  Sign out the user locally (clear cookies)
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
