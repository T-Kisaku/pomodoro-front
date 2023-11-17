import type {
    CountdownEvent,
    SetDurationEvent,
    CountdownData,
    ExpiredData
} from './type'

import { iniPomodoroContext } from './const'

let countdown: number
let intervalId: NodeJS.Timeout | null = null

countdown = iniPomodoroContext.timeCycle.work

const pomodoroContext = iniPomodoroContext


// Listen for messages from the main script
onmessage = function ({ data }: MessageEvent<CountdownEvent>) {
    switch (data.action) {
        case 'setDuration':
            setDuration(data.payload.timeCycle)
            break
        case 'start':
            start()
            break
        case 'stop':
            stop()
            break
    }
    postPomodoroContext()
    postCountDownData({message: 'countdown', payload: countdown})
};

function postCountDownData(event: CountdownData){
    postMessage(event)
}

function _setDuration(seconds: number) {
    stop()
    countdown = seconds
}
function setDuration(timeCycle: SetDurationEvent['payload']['timeCycle']) {
    switch (timeCycle) {
        case 'work':
            return _setDuration(pomodoroContext.timeCycle.work)
        case 'break.short':
            return _setDuration(pomodoroContext.timeCycle.break.short)
        case 'break.long':
            return _setDuration(pomodoroContext.timeCycle.break.long)
    }
}

function start() {
    if (intervalId === null) {
        intervalId = setInterval(() => {
            countdown--;

            // On expire!!
            if (countdown <= 0 && intervalId) {
                stop()
                // make sounds here
                // set next timer
                if (pomodoroContext.time === 'work') {
                    if ((pomodoroContext.pomodoroCount % 4) === 3) {
                        setDuration('break.long')
                    } else {
                        setDuration('break.short')
                    }
                    pomodoroContext.time = 'break'
                } else {
                    setDuration('work')
                    pomodoroContext.pomodoroCount++
                    pomodoroContext.time = 'work'
                }
                stop()
                const data: ExpiredData = { message: 'expired', payload: pomodoroContext }
                postMessage(data)
            }
            postCountDownData({message: 'countdown', payload: countdown})
        }, 1000);
    }
}

function stop() {
    if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
    }
}
function postPomodoroContext() {
    pomodoroContext.isPlaying = intervalId !== null
    postCountDownData({message: 'pomodoroContext', payload: pomodoroContext})
}