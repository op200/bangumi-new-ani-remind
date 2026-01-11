import { log } from "./log";
import { store } from "./store";

type ImageSet = Record<'small' | 'grid' | 'large' | 'medium' | 'common', string>

type Tag = {
    name: string
    count: number
    total_cont: number
}

export type SubjectNeedSave = {
    date: string
    images: ImageSet
    name: string
    name_cn: string
}

export type Subject = SubjectNeedSave & {
    short_summary: string
    tags: Tag[]
    score: number
    type: number
    id: number
    eps: number
    volumes: number
    collection_total: number
    rank: number
}

export type CollectionItemNeedSave = {
    updated_at: string
    subject: SubjectNeedSave
    subject_id: number
}

export type CollectionItem = CollectionItemNeedSave & {
    comment: string | null
    tags: any[]
    vol_status: number
    ep_status: number
    subject_type: number
    type: number
    rate: number
}

type CollectionResponse = {
    data: CollectionItem[]
    total: number
    limit: number
    offset: number
}

export enum Subject_type {
    全部 = 0,
    书籍 = 1,
    动画 = 2,
    音乐 = 3,
    游戏 = 4,
    三次元 = 6,
}
export enum Collections_type {
    全部 = 0,
    想看 = 1,
    看过 = 2,
    在看 = 3,
    搁置 = 4,
    抛弃 = 5,
}

namespace api {
    export async function collections(username: string, subject_type: Subject_type, type: Collections_type, limit: number, offset: number) {
        const response = await fetch(
            `https://api.bgm.tv/v0/users/${username}/collections?`
            + (subject_type ? `&subject_type=${subject_type}` : '')
            + (type ? `&type=${type}` : '')
            + `&limit=${limit}&offset=${offset}`
        )
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)
        return response
    }
}

/**
 * 判断缓存一致性，如果一致则直接返回缓存，否则刷新缓存 */
export async function flush_user_collection_cache(
    username: string,
    subject_type: Subject_type,
    type: Collections_type,
): Promise<void> {
    const collection_key = `${Subject_type[subject_type]}-${Collections_type[type]}`
    const collections_cache = store.collection_dict[collection_key] || []

    // 判断缓存一致性
    try {
        const once_response = await api.collections(username, subject_type, type, 1, 0)
        const once_data: CollectionResponse = await once_response.json()
        if (once_data.total >= 1 && once_data.total === collections_cache.length
            && once_data.data[0].subject_id === collections_cache.at(0)?.subject_id)
            return  // 一致，返回
    } catch (e) { log.error((e as Error).message, '一致性检测失败，强制刷新缓存') }

    // 不一致，刷新缓存
    log.debug('刷新缓存')
    const res_data: CollectionItem[] = []
    const LIMIT = 50
    let offset = 0, total = 0
    do {
        try {
            const response = await api.collections(username, subject_type, type, LIMIT, offset)
            const data: CollectionResponse = await response.json()
            res_data.push(...data.data)
            total = data.total
        } catch (e) { log.error((e as Error).message) }

        offset += LIMIT
    } while (offset <= total);

    store.collection_dict[collection_key] = res_data
    store.collection_dict = store.collection_dict
    return
}
