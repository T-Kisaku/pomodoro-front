import { load_Profile } from '$houdini'
import type { PageLoad } from './$houdini'

export const load: PageLoad = async (event) => {
    event.setHeaders({ 'Cache-Control': 'no-cache' })
    return {
        ...(await load_Profile({ event })),
    }
}