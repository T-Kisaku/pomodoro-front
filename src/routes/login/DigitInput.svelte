<script lang="ts">

    export let value: number | null = null
    export let ref: HTMLInputElement | null = null
    $: {
        if(value) value = Number(`${value}`.charAt(0))
    }
</script>


<svelte:options accessors />
<input
    {...$$restProps}
    type="number"
    class={`input focus:input-primary input-bordered input-md w-12 remove-arrow text-center ${$$restProps.class}`}
    bind:value={value}
    bind:this={ref}
/>