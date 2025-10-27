import { Body,Controller,Delete,Get,Param,Post,Put,Query,UseGuards } from '@nestjs/common';
import { ApiOperation,ApiResponse,ApiTags } from '@nestjs/swagger';
import { CacheService,ContextService,CreateArticleResponse,DeleteArticleResponse,EditArticleDto,EditArticleResponse,GetArticleByIdResponse,GetArticlesResponse,NewsPublisher,PublishArticleByIdResponse } from '@test/common';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../modules/auth/auth.guard';
import { AdminCreateArticleDto,AdminGetArticlesDto } from './news.dto';

@ApiTags('Статьи')
@Controller('news')
export class NewsController {
    constructor(
        private readonly newsPublisher: NewsPublisher,
        private readonly cacheService: CacheService,
        private readonly ctx: ContextService
    ) { }

    @Get()
    @ApiOperation({ description: 'Получить статьи без контента' })
    @ApiResponse({ type: GetArticlesResponse })
    async getArticles(@Query() dto: AdminGetArticlesDto) {
        return firstValueFrom(this.newsPublisher.getArticles({
            ...dto,userId: this.ctx.userId
        }));
    }

    @Get(':id')
    @ApiOperation({ description: 'Получить статью' })
    @ApiResponse({ type: GetArticleByIdResponse })
    async getArticleById(
        @Param('id') id: number
    ) {
        const article=await this.cacheService.get(id);

        if (article) {
            return article;
        }

        return firstValueFrom(this.newsPublisher.getArticleById({ id }));
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiOperation({ description: 'Удалить статью' })
    @ApiResponse({ type: DeleteArticleResponse })
    deleteArticle(
        @Param('id') id: number
    ) {
        return firstValueFrom(this.newsPublisher.deleteArticle({ id }));
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @ApiOperation({ description: 'Отредактировать статью' })
    @ApiResponse({ type: EditArticleResponse })
    editArticle(
        @Param('id') id: number,
        @Body() dto: EditArticleDto
    ) {
        return firstValueFrom(this.newsPublisher.editArticle({ ...dto,id }));
    }

    @UseGuards(AuthGuard)
    @Post()
    @ApiOperation({ description: 'Создать статью' })
    @ApiResponse({ type: CreateArticleResponse })
    createArticle(
        @Body() dto: AdminCreateArticleDto
    ) {
        return firstValueFrom(this.newsPublisher.createArticle({ ...dto,authorId: this.ctx.userId }));
    }

    @Put(':id/publish')
    @ApiOperation({ description: 'Опубликовать статью' })
    @ApiResponse({ type: PublishArticleByIdResponse })
    publishArticleById(
        @Param('id') id: number
    ) {
        return firstValueFrom(this.newsPublisher.publishArticleById({ id }));
    }
}