export interface BlogCard {
  slug: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Blog extends BlogCard {
  content: string;
}