import {findUserPaginateModel, UserViewPaginatedModel} from "../../models/repository/users-models";
import {usersCollection} from "../../db/db";
import {mapperQuery, sortDirectionList} from "./mapper-query";
import {mapperRepository} from "../mapper-repository";


export const usersQueryRepository = {
    async findUsersQuery(query: findUserPaginateModel): Promise<UserViewPaginatedModel> {
        let searchFilter = {}
        let searchArray = []
        if (query.searchLoginTerm)
            searchArray.push({"login": new RegExp(query.searchLoginTerm, "i")})
        if (query.searchEmailTerm)
            searchArray.push({"email": new RegExp(query.searchEmailTerm, "i")})
        if (searchArray.length > 0)
            searchFilter = {$or: searchArray}

        const totalCount = await usersCollection.countDocuments(searchFilter)
        const foundedUsers = await usersCollection
            .find(searchFilter)
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedBlogs = foundedUsers.map(
            b => mapperRepository.userOutputMongoDBtoUsersViewMongo(b))
        return mapperQuery.userViewModelToUserViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)

    }
}