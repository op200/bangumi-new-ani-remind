
import { PROJECT_NAME } from './global_val'

export namespace log {
    export function error(...data: any[]) {
        console.error(`超合金组件 ${PROJECT_NAME}`, ...data)
    }
}