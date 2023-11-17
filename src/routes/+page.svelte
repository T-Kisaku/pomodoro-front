<script lang="ts">
    import {MetaTags} from 'svelte-meta-tags';
	import { onMount } from 'svelte'
    import {useSound} from 'svelte-sound'
    import CountdownWorker from '$lib/worker/countdown/index.js?worker' // https://vitejs.dev/guide/assets.html#importing-script-as-a-worker
	import  type {CountdownEvent, CountdownData } from '$lib/worker/countdown/type';
	import  { iniPomodoroContext} from '$lib/worker/countdown/const';
    let worker: Worker | undefined
    let countdown = iniPomodoroContext.timeCycle.work
    let pomodoroContext = iniPomodoroContext
    onMount(() => {
    worker = new CountdownWorker()
    worker.onmessage = function(e: MessageEvent<CountdownData>){
        switch(e.data.message){
        case 'countdown':
            return countdown = e.data.payload
        case 'pomodoroContext':
            return pomodoroContext = e.data.payload
        }
    }
    })
    const clickSound = useSound('/sounds/mixkit-gate-latch-click-1924.wav', ["click"])
    $: setCountdownEvent = (event: CountdownEvent) => worker?.postMessage(event)

    $: minutes = `0${Math.floor(countdown / 60)}`.slice(-2)
    $: seconds = `0${countdown % 60}`.slice(-2)

</script>
<MetaTags title={`${minutes}:${seconds}`} description="Example Description." />
<div class="timer-card">{pomodoroContext?.isPlaying}
    <button
        on:click={
            Boolean(pomodoroContext?.isPlaying)
            ? ()=> setCountdownEvent({action: 'stop'})
            : ()=> setCountdownEvent({action: 'start'})
        }
        class="timer-main btn"
        use:clickSound
    >
        {minutes}:{seconds}
    </button>
    <p class="pomodoro-count">You have done for {pomodoroContext?.pomodoroCount} times!!</p>
    <p class="pomodoro-count">{pomodoroContext?.time === 'break'? "Break time": "Work time"}</p>
    <div class="timer-container">
        <button
            class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'work'}})}
            use:clickSound
        > Work</button>
        <button class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.short'}})}
            use:clickSound
        >Short break</button>
        <button
            class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.long'}})}
            use:clickSound
        >Long break</button>
    </div>
</div>
