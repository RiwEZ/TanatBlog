export interface BlogCard {
    id: number;
    slug: string;
    title: string;
    description: string;
    updated_at: string;
}

export interface Blog extends BlogCard {
    content: string;
    created_at: string;
}