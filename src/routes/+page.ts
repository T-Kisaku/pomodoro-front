import { load_Profile } from '$houdini'
import type { PageLoad } from './$houdini'

export const load: PageLoad = async (event) => {
    event.setHeaders({ 'cache-control': 'no-cache' })
    return {
        ...(await load_Profile({ event })),
    }
}