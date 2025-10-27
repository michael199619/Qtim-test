export const TRANSPORT_NEWS_KAFKA='TRANSPORT_NEWS_KAFKA';
export const TRANSPORT_NEWS_NATS='TRANSPORT_NEWS_NATS';
export const TRASPORT_NEWS_GROUP='TRANSPORT_NEWS_GROUP';

export enum NewsTopics {
    createArticle='create.article',
    deleteArticle='delete.article',
    editArticle='edit.article',
    publishArticleById='publish.article-by-id'
}

export enum NewsSubject {
    getArticles='get.articles',
    getArticleById='get.article-by-id'
}

export const newsTopics=Object.values(NewsTopics);