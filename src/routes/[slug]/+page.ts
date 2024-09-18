export const ssr = false;
export const csr = true;

import type { Load } from '@sveltejs/kit';
import { getUserwUsername } from "$lib/util/queryHandle";

export const load: Load = async ({ params }) => {
    const slug  = params.slug;
    let data = null;

    if(slug) {
        const response = await getUserwUsername(slug);
        data = response;
    }    

    return data;
}