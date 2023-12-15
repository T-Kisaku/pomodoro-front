<script lang="ts">
    import Header from "./Header.svelte";
    import type { Profile$result } from "$houdini";
    export let user: Profile$result['profile'] | null = null
</script>

<Header user={user}/>
<main class="pt-20">
    <slot/>
</main>