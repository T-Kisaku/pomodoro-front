export interface PomodoroContext {
    pomodoroCount: number,
    time: 'work' | 'break',
    timeCycle: {
        work: number,
        break: {
            short: number,
            long: number
        }
    }
    isPlaying: boolean
}

export interface Event<Action extends string> {
    action: Action
}
export interface PayloadEvent<Action extends string, Payload> extends Event<Action> {
    payload: Payload
}
export type SetDurationEvent = PayloadEvent<'setDuration', { timeCycle: 'work' | 'break.short' | 'break.long' }>
export type StartEvent = Event<'start'>
export type StopEvent = Event<'stop'>
export type CountdownEvent =
    SetDurationEvent | StartEvent | StopEvent

export interface DataType<Type extends string, Payload> {
    type: Type,
    payload: Payload
}

export interface Message<Message extends string> {
    message: Message
}
export interface PayloadMessage<Msg extends string, Payload> extends Message<Msg> {
    payload: Payload
}

export type CountdownSecondsData = PayloadMessage<'countdown', number>
export type ExpiredData = PayloadMessage<'expired', PomodoroContext>
export type PomodoroContextData = PayloadMessage<'pomodoroContext', PomodoroContext>
export type CountdownData =
    CountdownSecondsData |
    ExpiredData|
    PomodoroContextData