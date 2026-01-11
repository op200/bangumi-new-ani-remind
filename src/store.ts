import { STORE_KEYS } from "./global_val";
import { CollectionItemNeedSave, SubjectNeedSave } from "./user";

const DIFF_MS_EVAL_DEFAULT = 'return t1-t2 >= -365 && t1-t2 <= 30'

const NEED_SAVE_KEY_SET = new Set([
    "updated_at",
    "subject",
    "subject_id",
])

class Store {
    /**键是 Collections_type-Subject_type 的name的字符串拼接，例如 '动画-想看'*/
    private _collection_dict: Record<string, CollectionItemNeedSave[]> = JSON.parse(localStorage.getItem(STORE_KEYS.collection_dict) || '{}')
    get collection_dict(): Record<string, CollectionItemNeedSave[]> {
        return this._collection_dict
    }
    set collection_dict(new_collections: Record<string, CollectionItemNeedSave[]>) {
        this._collection_dict = Object.fromEntries(Object.entries(new_collections)
            .map(([collection_dict_key, collection_dict_val]) => [collection_dict_key,
                collection_dict_val.map(collection_item =>
                    Object.fromEntries(Object.entries(collection_item)
                        .filter(([k, v]) => NEED_SAVE_KEY_SET.has(k))
                        .map(([k, v]) => {
                            let new_v
                            if (typeof v === 'object' && 'id' in v)
                                new_v = {
                                    date: v.date,
                                    images: { small: v.images.small },
                                    name: v.name,
                                    name_cn: v.name_cn,
                                } as SubjectNeedSave
                            else
                                new_v = v
                            return [k, new_v]
                        })
                    ) as CollectionItemNeedSave)
            ])
        )
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
