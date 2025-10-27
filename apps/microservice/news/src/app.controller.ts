import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateArticleDto,DeleteArticleDto,EditArticleDto,GetArticleByIdDto,GetArticlesDto,INewsController,NewsSubject,NewsTopics,PublishArticleByIdDto } from '@test/common';
import { CreateArticleUsecase } from "./usecases/create-article/create-article.usecase";
import { DeleteArticleUsecase } from "./usecases/delete-article/delete-article.usecase";
import { EditArticleUsecase } from "./usecases/edit-article/edit-article.usecase";
import { GetArticleByIdUsecase } from "./usecases/get-article-by-id/get-article-by-id.usecase";
import { GetArticlesUsecase } from "./usecases/get-articles/get-articles.usecase";
import { PublishArticleByIdUsecase } from "./usecases/publish-article-by-id/publish-article-by-id.usecase";

@Controller()
export class AppController implements INewsController {
    constructor(
        private readonly getArticlesUsecase: GetArticlesUsecase,
        private readonly getArticleByIdUsecase: GetArticleByIdUsecase,
        private readonly deleteArticleUsecase: DeleteArticleUsecase,
        private readonly editArticleUsecase: EditArticleUsecase,
        private readonly createArticleUsecase: CreateArticleUsecase,
        private readonly publishArticleByIdUsecase: PublishArticleByIdUsecase
    ) { }

    @MessagePattern(NewsSubject.getArticles)
    getArticles(dto: GetArticlesDto) {
        return this.getArticlesUsecase.excecute(dto);
    }

    @MessagePattern(NewsSubject.getArticleById)
    getArticleById(dto: GetArticleByIdDto) {
        return this.getArticleByIdUsecase.excecute(dto);
    }

    @MessagePattern(NewsTopics.deleteArticle)
    deleteArticle(dto: DeleteArticleDto) {
        return this.deleteArticleUsecase.excecute(dto)
    }

    @MessagePattern(NewsTopics.editArticle)
    editArticle(dto: EditArticleDto) {
        return this.editArticleUsecase.excecute(dto);
    }

    @MessagePattern(NewsTopics.createArticle)
    createArticle(dto: CreateArticleDto) {
        return this.createArticleUsecase.excecute(dto);
    }

    @MessagePattern(NewsTopics.publishArticleById)
    publishArticleById(dto: PublishArticleByIdDto) {
        return this.publishArticleByIdUsecase.excecute(dto);
    }
} 