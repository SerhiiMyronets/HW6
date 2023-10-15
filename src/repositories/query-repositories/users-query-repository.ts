import {FindUserPaginateModel, UserViewModel, UserViewPaginatedModel} from "../../models/repository/users-models";
import {UserModel} from "../../db/db";
import {sortDirectionList} from "../../setting";
import {injectable} from "inversify";

@injectable()
export class UsersQueryRepository {
    async findUsersQuery(query: FindUserPaginateModel): Promise<UserViewPaginatedModel> {
        let searchFilter = {}
        let searchArray = []
        if (query.searchLoginTerm)
            searchArray.push({"accountData.login": new RegExp(query.searchLoginTerm, "i")})
        if (query.searchEmailTerm)
            searchArray.push({"accountData.email": new RegExp(query.searchEmailTerm, "i")})
        if (searchArray.length > 0)
            searchFilter = {$or: searchArray}
        const totalCount = await UserModel.countDocuments(searchFilter)

        const foundedUsers: UserViewModel[] = await UserModel
            .find(searchFilter, {
                _id: 0,
                id: {$toString: '$_id'},
                login: '$accountData.login',
                email: '$accountData.email',
                createdAt: '$accountData.createdAt'
            })
            .sort({[`accountData.${query.sortBy}`]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .lean()
        return this.getPaginated(foundedUsers, +query.pageNumber, +query.pageSize, totalCount)
    }
    async findUser(_id: string): Promise<UserViewModel | null> {
        return UserModel.findOne({_id}, {
            _id: 0,
            id: {$toString: '$_id'},
            login: '$accountData.login',
            email: '$accountData.email',
            createdAt: '$accountData.createdAt',
        }).lean()
    }
    getPaginated<Type>(items: Array<Type>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}