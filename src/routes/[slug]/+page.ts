import type { Load } from '@sveltejs/kit';
import { findUserByUsername } from "$lib/util/auth/userQueryHandle";
import ChamofileService from "$lib/util/chamofiles/chamofileHandle";

const chamofileService = new ChamofileService(); // Create an instance of ChamofileService

export const load: Load = async ({ params }) => {
    const slug  = params.slug;
    let data = null;

    if(slug) {
        const response = await findUserByUsername(slug);
        const chamofilesResponse = await chamofileService.fetchAllByUsername(slug);        
        if(response && chamofilesResponse) {
            data = {
                ...response,
                posts: chamofilesResponse
            }
        } else {
            data = null;
        }
    }

    return data;
}