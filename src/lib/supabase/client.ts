import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );

  return browserClient;
}
