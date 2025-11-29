import { flushSync } from 'react-dom'
import { Root } from 'react-dom/client'

import akarin_img from './assets/akarin.webp'
import { log } from './log'
import { store } from './store'
import { Collections_type, Subject_type } from './user'

const COLLECTION_KEY = `${Subject_type[Subject_type.动画]}-${Collections_type[Collections_type.想看]}`

async function render(root: Root, handle_settings_click: () => void): Promise<void> {
    let collections_filted_function: Function
    try {
        collections_filted_function = new Function('t1', 't2', store.diff_ms_eval)
        collections_filted_function(0, 0)
    } catch (_) {
        log.error('表达式不合法，还原为默认值')
        store.diff_ms_eval = ''
        collections_filted_function = new Function('t1', 't2', store.diff_ms_eval)
    }
    const collections_filted = store.collection_dict[COLLECTION_KEY]
        .filter(data => collections_filted_function(
            (new Date(data.subject.date)).getTime() / (24 * 60 * 60 * 1000),
            (new Date()).getTime() / (24 * 60 * 60 * 1000),
        ))

    // 同步渲染
    flushSync(() => root.render([
        <h3 className="hover-switch" onClick={handle_settings_click}>
            {/* 默认显示 */}
            <span className="default-text">近期<br />上映</span>
            {/* hover时显示 */}
            <span className="hover-text ico ico-sq ico_settings">设置</span>
        </h3>,
        <div className='coverList clearit' style={{ minHeight: '48px', display: "flex", alignItems: "center", flexWrap: 'wrap' }}>{
            collections_filted.length
                ? collections_filted
                    .sort((d1, d2) => (new Date(d1.subject.date)).getTime() - (new Date(d2.subject.date)).getTime())
                    .map(data =>
                        <a className='thumbTip' href={`/subject/${data.subject_id}`} data-original-title={
                            `${data.subject.name}<br/><small>${data.subject.name_cn ? data.subject.name_cn + '<br/>' : ''}${data.subject.date}</small>`}>
                            <img src={`//lain.bgm.tv/r/100x100/pic/${data.subject.images.small.split('/pic/')[1]}`} loading='lazy' />
                        </a>)
                : <a className='thumbTip' data-original-title='一部都没有'>
                    <img src={akarin_img} />
                </a>
        }</div>,
    ]))
}

export default {
    render
}