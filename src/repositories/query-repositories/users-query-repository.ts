import {findUserPaginateModel, UserViewPaginatedModel} from "../../models/repository/users-models";
import {usersCollection} from "../../db/db";
import {mapperQuery, sortDirectionList} from "./mapper-query";
import {mapperRepository} from "../mapper-repository";


export const usersQueryRepository = {
    async findUsersQuery(query: findUserPaginateModel): Promise<UserViewPaginatedModel> {
        let termLogin;
        let termEmail;
        if (query.searchLoginTerm === null) {
            termLogin = new RegExp(".*")
        } else {
            termLogin = new RegExp(".*" + query.searchLoginTerm + ".*", "i")
        }
        if (query.searchEmailTerm === null) {
            termEmail = new RegExp(".*")
        } else {
        termEmail = new RegExp(".*" + query.searchEmailTerm + ".*", "i")
        }
        const totalCount = await usersCollection.countDocuments({ $or: [{"login": termLogin}, {"email": termEmail}]})
        console.log(totalCount)
        const foundedUsers = await usersCollection
            .find({ $or: [{"login": termLogin}, {"email": termEmail}]})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedBlogs = foundedUsers.map(
            b => mapperRepository.userOutputMongoDBtoUsersViewMongo(b))

        return mapperQuery.userViewModelToUserViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)

    }
}