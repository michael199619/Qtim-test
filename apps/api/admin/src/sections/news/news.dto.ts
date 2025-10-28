import { OmitType } from "@nestjs/swagger";
import { CreateArticleDto,EditArticleDto,GetArticlesDto } from "@test/common";

export class AdminCreateArticleDto extends OmitType(CreateArticleDto,['authorId']) {

}

export class AdminGetArticlesDto extends OmitType(GetArticlesDto,['userId']) {

}

export class AdminEditArticleDto extends OmitType(EditArticleDto,['id']) {

}

