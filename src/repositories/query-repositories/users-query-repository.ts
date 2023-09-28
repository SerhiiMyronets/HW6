import {findUserPaginateModel, UserViewPaginatedModel} from "../../models/repository/users-models";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {mapperDbRepository} from "../mapper-db-repository";
import {UserModel} from "../../db/db";


export const usersQueryRepository = {
    async findUsersQuery(query: findUserPaginateModel): Promise<UserViewPaginatedModel> {
        let searchFilter = {}
        let searchArray = []
        if (query.searchLoginTerm)
            searchArray.push({"accountData.login": new RegExp(query.searchLoginTerm, "i")})
        if (query.searchEmailTerm)
            searchArray.push({"accountData.email": new RegExp(query.searchEmailTerm, "i")})
        if (searchArray.length > 0)
            searchFilter = {$or: searchArray}
        const totalCount = await UserModel.countDocuments(searchFilter)

        const foundedUsers = await UserModel
            .find(searchFilter)
            .sort({[`accountData.${query.sortBy}`]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        const mappedFoundedBlogs = foundedUsers.map(
            b => mapperDbRepository.userOutputMongoDBtoUsersViewMongo(b))
        return mapperQueryRepository.userViewModelToUserViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)

    }
}