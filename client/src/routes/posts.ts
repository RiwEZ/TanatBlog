import type { RequestHandlerOutput } from "@sveltejs/kit";

export async function get(): Promise<RequestHandlerOutput> {
    const res = await fetch('http://localhost:1337/posts');
    const data = await res.json()

    return { body: data };
}