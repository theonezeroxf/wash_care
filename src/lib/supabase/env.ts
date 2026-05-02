const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requireEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return requireEnv(
    supabasePublishableKey,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  );
}

export function getSupabaseServiceRoleKey() {
  return requireEnv(supabaseServiceRoleKey, "SUPABASE_SERVICE_ROLE_KEY");
}

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
