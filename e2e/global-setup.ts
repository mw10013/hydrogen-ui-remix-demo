// global-setup.ts
import type { Browser, FullConfig } from "@playwright/test";
import { chromium } from "@playwright/test";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "db_types";

async function globalSetup(config: FullConfig) {
}

export default globalSetup;
