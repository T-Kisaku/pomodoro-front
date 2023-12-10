import { HoudiniClient } from '$houdini';
import {PUBLIC_GRAPHQL_URL} from '$env/static/public'

export default new HoudiniClient({url: PUBLIC_GRAPHQL_URL})
