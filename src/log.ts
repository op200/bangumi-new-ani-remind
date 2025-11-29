import { PROJECT_NAME } from './global_val'

export namespace log {
    export function debug(...data: any[]) {
        console.debug(`超合金组件 ${PROJECT_NAME}`, ...data)
    }
    export function error(...data: any[]) {
        console.error(`超合金组件 ${PROJECT_NAME}`, ...data)
    }
}