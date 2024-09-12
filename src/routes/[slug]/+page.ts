export const ssr = false;
export const csr = true;

import type { Load } from '@sveltejs/kit';
import { getDocwUsername } from "$lib/util/queryHandle";

export const load: Load = async ({ params }) => {
    const slug  = params.slug;
    let data = null;

    if(slug) {
        const response = await getDocwUsername(slug);
        //data = response;
    }
    console.log(data);
    

    return data;
}