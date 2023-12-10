<script lang="ts">
    import {MetaTags} from 'svelte-meta-tags';
	import { onMount } from 'svelte'
    import CountdownWorker from '$lib/worker/countdown/index.js?worker' // https://vitejs.dev/guide/assets.html#importing-script-as-a-worker
	import  type {CountdownEvent, CountdownData } from '$lib/worker/countdown/type';
	import  { iniPomodoroContext } from '$lib/worker/countdown/const';
    import type {PageData} from './$houdini'
    import Header from '$src/components/Header.svelte'
    import Icon from '@iconify/svelte'
    
    export let data: PageData
    let countdown = iniPomodoroContext.timeCycle.work
    let pomodoroContext = iniPomodoroContext

    let
        worker: Worker | undefined,
        clickSound: HTMLAudioElement,
        expiredSound: HTMLAudioElement

    onMount(() => {
        worker = new CountdownWorker()
        clickSound = new Audio('/sounds/mixkit-gate-latch-click-1924.wav')
        expiredSound = new Audio('/sounds/mixkit-church-bell-calling-603.wav')
        worker.onmessage = function({data}: MessageEvent<CountdownData>){
            switch(data.message){
            case 'countdown':
                countdown = data.payload
                break
            case 'pomodoroContext':
                pomodoroContext = data.payload
                break
            case 'expired':
                console.log('fire')
                pomodoroContext = data.payload
                expiredSound.play()
                setTimeout(() => expiredSound.pause(), 5500) // 5.5sec
                break
            }
        }
    })
    $: setCountdownEvent = (event: CountdownEvent) => {
        clickSound.play()
        worker?.postMessage(event)
    }

    $: minutes = `0${Math.floor(countdown / 60)}`.slice(-2)
    $: seconds = `0${countdown % 60}`.slice(-2)
    $: initial = pomodoroContext.time === 'work'
        ? pomodoroContext.timeCycle.work
        : pomodoroContext.time === 'break.long'
            ?pomodoroContext.timeCycle.break.long
            : pomodoroContext.timeCycle.break.short
    $: progressRate = (countdown / initial) * 100
    $: ({ Profile } = data)
</script>

<MetaTags title={`${minutes}:${seconds}`} description="Example Description." />
<Header user={$Profile.data?.profile}/>
<div class="flex flex-col justify-center items-center gap-10">
    <div class="radial-progress text-primary font-extrabold" style={`--value:${progressRate}; --size:30rem; --thickness: 2rem;`} role="progressbar">
        <p class="flex justify-center items-center gap-1 text-2xl">
            <Icon icon="emojione-monotone:tomato" />
            {pomodoroContext?.pomodoroCount}
        </p>
        <p class="text-9xl">{minutes}:{seconds}</p>
    </div>
    <button
        class="btn btn-square btn-lg"
        on:click={
            Boolean(pomodoroContext?.isPlaying)
            ? ()=> setCountdownEvent({action: 'stop'})
            : ()=> setCountdownEvent({action: 'start'})
        }
    >
        {#if Boolean(pomodoroContext?.isPlaying)}
            <Icon icon="mdi:pause" class="text-4xl"/>
        {:else}
            <Icon icon="mdi:play" class="text-4xl"/>
        {/if}
    </button>
    <div>
        <button
            class={`btn w-40 ${pomodoroContext.time === 'work'? 'btn-primary': ''}`}
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'work'}})}
        >
            <Icon icon="mdi:pencil" class="text-2xl"/> Work
        </button>
        <button
        class={`btn w-40 ${pomodoroContext.time === 'break.short'? 'btn-primary': ''}`}
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.short'}})}
        >
            <Icon icon="fa6-solid:mug-hot" class="text-2xl" /> Short break
        </button>
        <button
        class={`btn w-40 ${pomodoroContext.time === 'break.long'? 'btn-primary': ''}`}
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.long'}})}
        >
            <Icon icon="fa6-solid:moon" class="text-2xl"/> Long break
        </button>
    </div>
</div>