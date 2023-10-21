import { writable, get } from "svelte/store"
import { reset, setInitialSeconds } from '$lib/stores/timer'

export const
    isBreakTime = writable<boolean>(false),
    pomodoroCount = writable<number>(0),

    setShortBreak = () => {
        isBreakTime.set(true)
        setInitialSeconds(5 * 60)
    },
    setLongBreak = () => {
        isBreakTime.set(true)
        setInitialSeconds(15 * 60)
    },
    setWork = () => {
        isBreakTime.set(false)
        setInitialSeconds(25 * 60)
    },
    nextTime = () => {
        if(get(isBreakTime)) setWork()
        else {
            pomodoroCount.update(x => ++x)
            setShortBreak()
        }
        reset()
    }


