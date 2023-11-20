<script lang="ts">
    import {MetaTags} from 'svelte-meta-tags';
	import { onMount } from 'svelte'
    import CountdownWorker from '$lib/worker/countdown/index.js?worker' // https://vitejs.dev/guide/assets.html#importing-script-as-a-worker
	import  type {CountdownEvent, CountdownData } from '$lib/worker/countdown/type';
	import  { iniPomodoroContext } from '$lib/worker/countdown/const';

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

</script>
<MetaTags title={`${minutes}:${seconds}`} description="Example Description." />
<div class="timer-card">
    <button
        on:click={
            Boolean(pomodoroContext?.isPlaying)
            ? ()=> setCountdownEvent({action: 'stop'})
            : ()=> setCountdownEvent({action: 'start'})
        }
        class="timer-main btn"
    >
        {minutes}:{seconds}
    </button>
    <p class="pomodoro-count">You have done for {pomodoroContext?.pomodoroCount} times!!</p>
    <p class="pomodoro-count">{pomodoroContext?.time === 'break'? "Break time": "Work time"}</p>
    <div class="timer-container">
        <button
            class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'work'}})}
        > Work</button>
        <button class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.short'}})}
        >Short break</button>
        <button
            class="btn"
            on:click={() => setCountdownEvent({action: 'setDuration', payload: {timeCycle: 'break.long'}})}
        >Long break</button>
    </div>
</div>