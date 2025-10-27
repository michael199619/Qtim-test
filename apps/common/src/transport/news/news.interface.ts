import { ControllerResponse } from "../../utils";
import { CreateArticleDto,CreateArticleResponse,DeleteArticleDto,DeleteArticleResponse,EditArticleDto,EditArticleResponse,GetArticleByIdDto,GetArticleByIdResponse,GetArticlesDto,GetArticlesResponse,PublishArticleByIdDto,PublishArticleByIdResponse } from "./dtos";

export interface INewsTransportOptions {
    clientId: string;
    kafkaBrokers: string[];
    natsServers: string[];
}

export type INewsController={
    getArticles(dto: GetArticlesDto): ControllerResponse<GetArticlesResponse>,
    getArticleById(dto: GetArticleByIdDto): ControllerResponse<GetArticleByIdResponse>
    createArticle(dto: CreateArticleDto): ControllerResponse<CreateArticleResponse>
    editArticle(dto: EditArticleDto): ControllerResponse<EditArticleResponse>
    deleteArticle(dto: DeleteArticleDto): ControllerResponse<DeleteArticleResponse>
    publishArticleById(dto: PublishArticleByIdDto): ControllerResponse<PublishArticleByIdResponse>
}