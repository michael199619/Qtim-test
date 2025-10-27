import { ClientKafka,ClientNats } from "@nestjs/microservices";
import { NewsSubject,NewsTopics,newsTopics } from "./constants";
import { CreateArticleDto,CreateArticleResponse,DeleteArticleDto,DeleteArticleResponse,EditArticleDto,EditArticleResponse,GetArticleByIdDto,GetArticleByIdResponse,GetArticlesDto,GetArticlesResponse,PublishArticleByIdDto,PublishArticleByIdResponse } from "./dtos";
import { INewsController } from "./news.interface";

export class NewsPublisher implements INewsController {
    constructor(
        private kafkaService: ClientKafka,
        private natsService: ClientNats
    ) {
    }

    private async onApplicationBootstrap() {
        newsTopics.forEach(pattern => this.kafkaService.subscribeToResponseOf(pattern))
        await this.kafkaService.connect()
    }

    createArticle(dto: CreateArticleDto) {
        return this.kafkaService.send<CreateArticleResponse>(NewsTopics.createArticle,dto)
    }

    editArticle(dto: EditArticleDto) {
        return this.kafkaService.send<EditArticleResponse>(NewsTopics.editArticle,dto)
    }

    deleteArticle(dto: DeleteArticleDto) {
        return this.kafkaService.send<DeleteArticleResponse>(NewsTopics.deleteArticle,dto)
    }

    getArticleById(dto: GetArticleByIdDto) {
        return this.natsService.send<GetArticleByIdResponse>(NewsSubject.getArticleById,dto)
    }

    getArticles(dto: GetArticlesDto) {
        return this.natsService.send<GetArticlesResponse>(NewsSubject.getArticles,dto)
    }

    publishArticleById(dto: PublishArticleByIdDto) {
        return this.kafkaService.send<PublishArticleByIdResponse>(NewsTopics.publishArticleById,dto)
    }
}