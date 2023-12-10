import type {
    CountdownEvent,
    SetDurationEvent,
    CountdownData,
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
    postCountDownData('pomodoroContext')
    postCountDownData('countdown')
};

function postCountDownData(message: CountdownData['message']){
    let data: CountdownData | null = null
    switch(message){
        case 'expired':
        case 'pomodoroContext':
            pomodoroContext.isPlaying = intervalId !== null
            data = {message, payload: pomodoroContext}
            break
        case 'countdown':
            data = {message: 'countdown', payload: countdown}
            break
    }
    postMessage(data)
}

function _setDuration(seconds: number) {
    stop()
    countdown = seconds
}
function setDuration(timeCycle: SetDurationEvent['payload']['timeCycle']) {
    pomodoroContext.time = timeCycle
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
                    let time: SetDurationEvent['payload']['timeCycle'] = 'break.short'
                    if ((pomodoroContext.pomodoroCount % 4) === 3) {
                        time = 'break.long'
                    }
                    setDuration(time)
                } else {
                    setDuration('work')
                    pomodoroContext.pomodoroCount++
                }

                postCountDownData('expired')
            }
            postCountDownData('countdown')
        }, 1000);
    }
}

function stop() {
    if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
    }
}