import { HoudiniClient } from '$houdini';
import {PUBLIC_GRAPHQL_URL} from '$env/static/public'

/**
 * https://stackoverflow.com/questions/76733791/how-would-you-implement-session-based-auth-with-sveltekit-and-an-external-rest-a
 */
export default new HoudiniClient({
    url: PUBLIC_GRAPHQL_URL,
    fetchParams() {
        return {
            credentials: 'include'
        }
    },
})
