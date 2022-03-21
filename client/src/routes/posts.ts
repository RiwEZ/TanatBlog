import type { RequestHandlerOutput } from "@sveltejs/kit";

export const get = async (): Promise<RequestHandlerOutput> => {
    const res = await fetch('http://localhost:1337/api/posts');
    const jsonresp = await res.json();

    return { body: jsonresp.data };
}