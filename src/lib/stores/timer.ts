import { get, writable } from "svelte/store"

export interface TimerSettings {
    initialSeconds: number | null,
    onExpire?: () => void
}

export const
    /** Store values */
    remainedSeconds = writable<number | null>(null),
    interval = writable<NodeJS.Timeout|null>(null),
    isRunning = writable<boolean>(false),
    settings = writable<TimerSettings>({
        initialSeconds: null
    }),
    /** Store manipulators */
    clearIntervalStore = () => {
        const t = get(interval)
        if(t) {
            clearInterval(t)
            interval.set(null)
        }
    },
    countdown = () => remainedSeconds.update(x => {
        if(x == null) return null
        else if(x > 0)return --x
        else if (x == 0) {
            clearIntervalStore()
            const onExpire = get(settings).onExpire
            if(onExpire) onExpire()
            return 0
        }
        return null
    }),
    setInitialSeconds = (initialSeconds: TimerSettings['initialSeconds']) => {
        settings.update(x =>({...x, initialSeconds: initialSeconds}))
    },
    start = () => isRunning.set(true),
    pause = () => {
        isRunning.set(false)
        clearIntervalStore()
    },
    reset = () => {
        pause()
        settings.subscribe(settings => remainedSeconds.set(settings.initialSeconds))
        clearIntervalStore()
    },
    onMount = () => {
        settings.subscribe(settings => {
            pause()
            remainedSeconds.set(settings.initialSeconds)
            setTimeout(() => reset() , 1)
        })
        isRunning.subscribe(isRunning => {
            if(isRunning) interval.set(setInterval(countdown, 1000))
            else clearIntervalStore()
        })
    },
    convertToDisplayNumber = (x: number) => x < 10? `0${x}`: x