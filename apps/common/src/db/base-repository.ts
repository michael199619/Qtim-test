import { DataSource,EntityTarget,ObjectLiteral,Repository } from "typeorm";
import { PaginationDto,PaginationResponse } from "../utils";

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
    constructor(
        datasoure: DataSource,
        entity: EntityTarget<Entity>
    ) {
        super(entity,datasoure.createEntityManager())
    }

    public preparePagination(pagination: PaginationDto): {
        skip?: number;
        take?: number;
    } {
        const page=Math.round(pagination.page);
        const take=Math.round(pagination.limit);

        return { take,skip: (page-1)*take };
    }

    public paginationResponse<T>({
        data,
        total,
        take,
        page,
    }: {
        data: T[];
        total: number;
        take?: number;
        page?: number;
    }): PaginationResponse<T> {
        return {
            data,
            perPage: take??total,
            pageCount: take? Math.ceil(total/take):1,
            total,
            page: page??1,
        };
    }
}