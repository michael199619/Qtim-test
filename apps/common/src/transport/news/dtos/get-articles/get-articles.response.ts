import { ApiProperty,OmitType } from "@nestjs/swagger";
import { PaginationResponse } from "../../../../utils/pagination";
import { GetArticleByIdResponse } from "../get-article-by-id";

class GetArticles extends OmitType(GetArticleByIdResponse,['description']) {

}

export class GetArticlesResponse extends PaginationResponse<GetArticles> {
  @ApiProperty({
    type: GetArticles,
    isArray: true,
    description: 'Статьи'
  })
  data: GetArticles[];
}