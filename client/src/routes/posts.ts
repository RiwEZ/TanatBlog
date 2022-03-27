import type { RequestHandlerOutput } from "@sveltejs/kit";
//import type { JSONObject } from "@sveltejs/kit/types/internal";
import qs from "qs";

/*
interface APIdata extends JSONObject {
    id: number;
    attributes: {
        title: string;
        description: string;
        content: string;
        createdAt: string;
        updatedAt: string;
    }
}
*/

export const get = async (): Promise<RequestHandlerOutput> => {
    const query = qs.stringify({
        fields: ["title", "description", "updatedAt", "slug"],
        sort: ["createdAt:desc"],
    })

    const res = await fetch(`http://localhost:1337/api/posts?${query}`);
    const jsonresp = await res.json();
    const data = jsonresp.data;

    /*
    const data: APIdata[] = [];
    for (let i = 0; i < 1000; i++) {
        const d: APIdata = {
            id: i,
            attributes: {
                title: i.toString(),
                description: "",
                content: "",
                createdAt: "",
                updatedAt: "",
            }
        }
        data.push(d);
    }
    data.reverse();
    */

    return { body: data };
}