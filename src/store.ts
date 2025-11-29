import { STORE_KEYS } from "./global_val";
import { CollectionItem } from "./user";

// TODO: 上个版本的废弃数据，下个版本移除
localStorage.removeItem('bangumi-new-ani-remind-diff-ms')
localStorage.removeItem('bangumi-new-ani-remind-collections')

const DIFF_MS_EVAL_DEFAULT = 'return t1-t2 >= -365 && t1-t2 <= 30'

class Store {
    /**键是 Collections_type-Subject_type 的name的字符串拼接，例如 '动画-想看'*/
    private _collection_dict: Record<string, CollectionItem[]> = JSON.parse(localStorage.getItem(STORE_KEYS.collection_dict) || '{}')
    get collection_dict(): Record<string, CollectionItem[]> {
        return this._collection_dict
    }
    set collection_dict(new_collections: Record<string, CollectionItem[]>) {
        this._collection_dict = new_collections
        localStorage.setItem(STORE_KEYS.collection_dict, JSON.stringify(this._collection_dict))
    }

    private _diff_ms_eval: string = localStorage.getItem(STORE_KEYS.diff_ms_eval) || DIFF_MS_EVAL_DEFAULT
    get diff_ms_eval(): string {
        return this._diff_ms_eval
    }
    set diff_ms_eval(new_diff_eval: string) {
        this._diff_ms_eval = new_diff_eval || DIFF_MS_EVAL_DEFAULT
        localStorage.setItem(STORE_KEYS.diff_ms_eval, this._diff_ms_eval)
    }
}

export const store = new Store()
