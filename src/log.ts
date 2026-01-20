import { PROJECT_NAME } from './global_val'

const log_head = [`%c超合金组件 ${PROJECT_NAME}`, 'color: white;background-color: #ff6699;padding: 0 0.5em;']

export namespace log {
    export function debug(...data: any[]) {
        console.debug(...log_head, ...data)
    }
    export function error(...data: any[]) {
        console.error(...log_head, ...data)
    }
}