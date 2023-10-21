<script lang="ts">
	import { onMount } from 'svelte';
    import {
        remainedSeconds,
        isRunning,
        settings,
        start,
        pause,
        setInitialSeconds,
        onMount as onMountTimer,
        convertToDisplayNumber,
    } from '$lib/stores/timer'
    import {
        pomodoroCount,
        isBreakTime,
        setShortBreak,
        setLongBreak,
        setWork,
		nextTime
    } from '$lib/stores/pomodoro'
    import {useSound, Sound} from 'svelte-sound'
    const timeoutSound = new Sound('/sounds/mixkit-church-bell-calling-603.wav')
    const clickSound = useSound('/sounds/mixkit-gate-latch-click-1924.wav', ["click"])
    onMount(() => {
        setWork()
        onMountTimer()
        settings.update(settings => ({
            ...settings,
            onExpire: () => {
                let timeout: NodeJS.Timeout | null = null
                timeoutSound.play()
                timeout = setTimeout(() => {
                    timeoutSound.destroy()
                    if(timeout) clearTimeout(timeout)
                }, 7000)
                nextTime()
            }
        }))
    })

    let settingsMinutes: number | null = null
    $: setInitialSeconds(settingsMinutes? settingsMinutes * 60: null)

    $: m = convertToDisplayNumber($remainedSeconds? Math.floor($remainedSeconds / 60): 0)
    $: s = convertToDisplayNumber($remainedSeconds? $remainedSeconds % 60: 0)
</script>

<div class="timer-card">
    <button
        on:click={$isRunning? pause:start} class="timer-main btn"
        use:clickSound
    >
        {m}:{s}
    </button>
    <p class="pomodoro-count">You have done for {$pomodoroCount} times!!</p>
    <p class="pomodoro-count">{$isBreakTime? "Break time": "Work time"}</p>
    <div class="timer-container">
        <button class="btn" on:click={setWork} use:clickSound>Work</button>
        <button class="btn" on:click={setShortBreak} use:clickSound>Short break</button>
        <button class="btn" on:click={setLongBreak} use:clickSound>Long break</button>
    </div>
</div>
