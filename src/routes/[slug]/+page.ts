export const ssr = false;
export const csr = true;

import type { Load } from '@sveltejs/kit';
import { findUserByUsername } from "$lib/util/userQueryHandle";

export const load: Load = async ({ params }) => {
    const slug  = params.slug;
    let data = null;

    if(slug) {
        const response = await findUserByUsername(slug);
        data = response;
    }

    return data;
}