import type {PomodoroContext} from './type'
export const iniPomodoroContext: PomodoroContext = {
    pomodoroCount: 0,
    time: 'work',
    timeCycle: {
        work: 25 * 60,
        break: {
            short: 5 * 60,
            long: 20 * 60
        }
    },
    isPlaying: false
}