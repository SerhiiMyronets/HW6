import {findUserPaginateModel, UserViewPaginatedModel} from "../../models/repository/users-models";
import {usersCollection} from "../../db/db";
import {mapperQuery, sortDirectionList} from "./mapper-query";
import {mapperRepository} from "../mapper-repository";


export const usersQueryRepository = {
    async findUsersQuery(query: findUserPaginateModel): Promise<UserViewPaginatedModel> {
        const termLogin = new RegExp(".*" + query.searchLoginTerm + ".*", "i")
        const termEmail = new RegExp(".*" + query.searchEmailTerm + ".*", "i")
        const totalCount = await usersCollection.countDocuments({"login": termLogin, "email": termEmail})
        const foundedUsers = await usersCollection
            .find({"login": termLogin, "email": termEmail})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        console.log(foundedUsers)
        const mappedFoundedBlogs = foundedUsers.map(
            // @ts-ignore
            b => mapperRepository.userOutputMongoDBtoUsersViewMongo(b))

        return mapperQuery.userViewModelToUserViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)

    }
}