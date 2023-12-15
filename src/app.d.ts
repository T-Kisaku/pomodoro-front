// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Profile$result } from "$houdini";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			profile: Profile$result['profile']
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
