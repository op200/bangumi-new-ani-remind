import { createRoot, Root } from 'react-dom/client'

import ani_wish from './ani_wish'
import { PROJECT_NAME } from './global_val'
import { log } from './log'
import { store } from './store'
import { Collections_type, flush_user_collection_cache, Subject_type } from './user'

import './main.css'


async function run(flush_ani_data: boolean = true): Promise<void> {
    const target_element = document.querySelector('#home_calendar ul.calendarMini')
    if (target_element === null) return log.error("获取目标元素失败")

    // 创建前删除 wrapper
    const existing_wrapper = $(`#${PROJECT_NAME}`)
    if (existing_wrapper) existing_wrapper.remove()

    // 创建 wrapper
    const wrapper = document.createElement('li')
    wrapper.id = PROJECT_NAME
    wrapper.className = `clearit week`
    wrapper.style = "background-color:var(--primary-color);"
    target_element.appendChild(wrapper)

    const username = $(".idBadgerNeue a.avatar").attr("href")?.split("/").at(-1)
    if (username === undefined) return log.error("获取 username 失败")

    // 刷新收藏数据
    if (flush_ani_data) {
        if (Math.abs(new Date().getTime() - store.collection_dict_update_time.getTime()) > 7 * 24 * 60 * 60 * 1000)
            // 一段时间内未刷新则强制刷新，因为有些番在收藏时没有开播时间
            // 通过删除缓存，让刷新函数认为缓存不一致，以刷新
            store.collection_dict = {}

        await flush_user_collection_cache(username, Subject_type.动画, Collections_type.想看)
    }

    const root: Root = createRoot(wrapper)

    await ani_wish.render(root, () => {
        const input_val = prompt(
            '设置 function(t1, t2, temp): boolean 的计算表达式\n'
            + '  t1: number 动画开播时间 (单位 天)\n'
            + '  t2: number 当前时间 (单位 天)\n'
            + '  temp: Object 属性 value, index, array 为 filter 的回调的形参，可用于查询当前上下文和存储一些临时数据\n'
            + '\n'
            + 'e.g.\n'
            + '  temp.n = temp.n || 0; let within_time = t1-t2 >= -365 && t1-t2 <= 30; temp.n += Number(within_time); return within_time && temp.n <= 5\n'
            + '\n'
            + '释义: 已开播 365 天内、或 30 天内即将开播的条目，按顺序展示前 5 个\n'
            + '\n'
            + '注意: 如果代码不合法会还原为默认值',
            store.diff_ms_eval,
        )

        if (input_val === null || input_val.trim() === '') return

        store.diff_ms_eval = input_val

        // 刷新节点
        run(false)
    })

    // 添加 tooltip
    $(wrapper).find('a.thumbTip').tooltip({ html: true } as any)
}

run()
