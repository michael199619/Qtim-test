import { Injectable } from "@nestjs/common";
import { BaseRepository,CreateUserDto,EditUserDto,GetUsersDto } from "@test/common";
import { DataSource,FindOptionsWhere,In } from "typeorm";
import { User } from "../entities/User.entity";

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    constructor(
        datasoure: DataSource
    ) {
        super(datasoure,User)
    }

    async getUsers(dto: GetUsersDto) {
        const { skip,take }=this.preparePagination(dto);
        const where: FindOptionsWhere<User>={};

        if (dto.ids.length) {
            where.id=In(dto.ids);
        }

        const [articles,total]=await this.findAndCount({
            skip,
            take,
            where
        });

        return this.paginationResponse({ data: articles,total,take,page: dto.page });
    }

    getUserById(id: number) {
        return this.findOne({ select: ['id','login','name'],where: { id } })
    }

    getUserByLoginOrId(str: string|number) {
        const where: FindOptionsWhere<User>={};

        if (typeof str==='number') {
            where.id=str
        } else {
            where.login=str
        }

        return this.findOne({ select: ['id','password'],where })
    }

    createUser(dto: CreateUserDto) {
        return this.save({
            name: dto.name,
            password: dto.password,
            login: dto.login
        })
    }

    async removeUserById(id: number) {
        await this.softDelete(id)
    }

    editUser(dto: EditUserDto) {
        return this.update(dto.id,{
            name: dto.name
        })
    }

    changePasswordUser(id: number,password: string) {
        return this.update(id,{
            password
        })
    }

} 