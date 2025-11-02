import { Injectable } from "@nestjs/common";
import { ArticleStatus,BaseRepository,CreateArticleDto,EditArticleDto,GetArticlesDto } from "@test/common";
import { And,Between,DataSource,Equal,FindOptionsWhere,LessThan,Like,MoreThan,Not } from "typeorm";
import { Article } from "../entities/Article.entity";

@Injectable()
export class ArticlesRepository extends BaseRepository<Article> {
    constructor(
        datasoure: DataSource
    ) {
        super(datasoure,Article)
    }

    getArticleById(id: string) {
        return this.findOne({ select: ['id','title','description','publishedAt','createdAt','authorId','updatedAt','content'],where: { id } })
    }

    createArticle(dto: CreateArticleDto): Promise<Article> {
        return this.save({
            title: dto.title,
            description: dto.description,
            authorId: dto.authorId,
            content: dto.content,
            status: ArticleStatus.DRAFT
        });
    }

    publishArticleById(id: string) {
        return this.update(id,{
            status: ArticleStatus.PUBLISH,
            publishedAt: new Date()
        })
    }

    async deleteArticle(id: string) {
        await this.delete(id)
    }

    editArticle(dto: EditArticleDto) {
        return this.update(dto.id,{
            title: dto.title,
            description: dto.description,
            content: dto.content
        })
    }

    async getArticles(dto: GetArticlesDto) {
        const { skip,take }=this.preparePagination(dto);
        const where: FindOptionsWhere<Article>={};
        const or: FindOptionsWhere<Article>[]=[];

        if (dto.authorId) {
            where.authorId=dto.authorId;
        }

        if (dto.status) {
            where.status=dto.status;
        }

        if (dto.dateFrom) {
            where.createdAt=MoreThan(dto.dateFrom)
        }

        if (dto.dateTo) {
            where.createdAt=dto.dateFrom? Between(dto.dateFrom,dto.dateTo):LessThan(dto.dateTo)
        }

        if (dto.isMy!==undefined&&dto.userId) {
            if (!dto.isMy) {
                where.authorId=dto.authorId? And(Equal(dto.authorId),Not(dto.userId)):Not(dto.userId);
            } else {
                where.authorId=dto.userId;
            }
        }

        if (dto.search) {
            or.push({
                ...where,
                title: Like(`%${dto.search}%`),
            });

            or.push({
                ...where,
                description: Like(`%${dto.search}%`),
            });
        }

        const [articles,total]=await this.findAndCount({
            skip,
            take,
            select: ['authorId','createdAt','id','status','publishedAt','title','updatedAt'],
            where: or.length? or:where,
            order: {
                createdAt: 'DESC',
            },
        });

        return this.paginationResponse({ data: articles,total,take,page: dto.page });
    }

} 