import { log } from "./log";

type ImageSet = Record<'small' | 'grid' | 'large' | 'medium' | 'common', string>;

type Tag = {
    name: string;
    count: number;
    total_cont: number;
};

type Subject = {
    date: string;
    images: ImageSet;
    name: string;
    name_cn: string;
    short_summary: string;
    tags: Tag[];
    score: number;
    type: number;
    id: number;
    eps: number;
    volumes: number;
    collection_total: number;
    rank: number;
};

export type CollectionItem = {
    updated_at: string;
    comment: string | null;
    tags: any[];
    subject: Subject;
    subject_id: number;
    vol_status: number;
    ep_status: number;
    subject_type: number;
    type: number;
    rate: number;
    private: boolean;
};

type CollectionResponse = {
    data: CollectionItem[];
    total: number;
    limit: number;
    offset: number;
};

export async function get_user_collections(username: string) {
    const res_data: CollectionItem[] = []

    const LIMIT = 50
    let offset = 0, total = 0
    do {
        try {
            const response = await fetch(`https://api.bgm.tv/v0/users/${username}/collections?subject_type=2&type=1&limit=${LIMIT}&offset=${offset}`)
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`)

            const data: CollectionResponse = await response.json()
            res_data.push(...data.data)
            total = data.total
        } catch (e) { log.error((e as Error).message) }

        offset += LIMIT
    } while (offset <= total);

    return res_data
}
