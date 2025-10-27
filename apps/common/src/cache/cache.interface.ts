export enum CacheEntity {
    ARTICLE='article'
}

export interface ICacheOptions {
    entity: CacheEntity,
    ttl: number
}