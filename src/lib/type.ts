import type { JSONObject } from "@sveltejs/kit/types/private";

export interface Blog extends JSONObject {
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  content: string
  slug: string;
}