import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { PROJECT_NAME } from './global_val'
import { log } from './log'
import { CollectionItem, get_user_collections } from './user'

import './main.css'

let collections: CollectionItem[]

async function run(flush_ani_data: boolean = true) {
  const diff_ms = Number(localStorage.getItem(PROJECT_NAME + '-diff-ms')) || 365 * 24 * 60 * 60 * 1000

  const target_element = document.querySelector('#home_calendar ul.calendarMini')
  if (target_element === null) return log.error("Get target element error")

  // 创建前删除 wrapper
  const existing_wrapper = $(`#${PROJECT_NAME}`)
  if (existing_wrapper) existing_wrapper.remove()

  // 创建 wrapper
  const wrapper = document.createElement('li')
  wrapper.id = PROJECT_NAME
  wrapper.className = `clearit week ${PROJECT_NAME}`
  wrapper.style = "background-color:var(--primary-color);"
  target_element.appendChild(wrapper)

  // 获取 username
  const user_url = $(".idBadgerNeue a.avatar").attr("href")
  if (user_url === undefined) return log.error("Get username faild: 1")
  const username = user_url.split("/").at(-1)
  if (username === undefined) return log.error("Get username faild: 2")

  // 获取数据
  if (flush_ani_data) collections = await get_user_collections(username)
  const root = createRoot(wrapper)
  const collections_filted = collections.filter(data => Math.abs((new Date(data.subject.date)).getTime() - (new Date()).getTime()) <= diff_ms)

  function _handle_settings_click(): void {
    // 当前值天数
    const currentDays = diff_ms / (24 * 60 * 60 * 1000)

    // 创建输入框
    const inputValue = prompt(
      `设置动画开播时间与当前时间的差的绝对值（天）\n当前值: ${currentDays}天`,
      currentDays.toString()
    )

    // 判断 和 取消
    if (inputValue === null || inputValue.trim() === '') return

    // 验证输入是否为有效正数
    const days = Number(inputValue)
    if (isNaN(days) || days <= 0) {
      alert('只能输入正数')
      return
    }

    // 转换为毫秒并保存到localStorage
    const newDiffMs = days * 24 * 60 * 60 * 1000
    localStorage.setItem(PROJECT_NAME + '-diff-ms', newDiffMs.toString())

    // 刷新节点
    run(false)
  }

  // 同步渲染
  flushSync(() => root.render([
    <h3 className="hover-switch">
      {/* 默认显示 */}
      <span className="default-text">近期<br />上映</span>
      {/* hover时显示 */}
      <span className="hover-text ico ico-sq ico_settings" onClick={_handle_settings_click}>设置</span>
    </h3>,
    <div className='coverList clearit' style={{ minHeight: 48, display: "flex", alignItems: "center" }}>{
      collections_filted.length
        ? collections_filted
          .sort(data => (new Date(data.subject.date)).getTime())
          .map(data =>
            <a className='thumbTip' href={`/subject/${data.subject_id}`} title='' data-original-title={`${data.subject.name}<br/><small>${data.subject.name_cn}</small>`}>
              <img src={`//lain.bgm.tv/r/100x100/pic/${data.subject.images.small.split('/pic/')[1]}`} width={48} loading='lazy' style={{ verticalAlign: 'top' }} />
            </a>
          )
        : <p style={{ color: "var(--primary-color)", width: "100%", textAlign: "center" }}>空的</p>
    }</div>,
  ]))

  $(wrapper).find('a.thumbTip').tooltip({ html: true } as any)
}

run()
