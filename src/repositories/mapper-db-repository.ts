import {
    BlogMongoDBModel,
    CommentDBType,
    DeviceAuthSessionMongoDBModel,
    PostMongoDBModel,
    UsersMongoDBModel
} from "../db/db-models";
import {WithId} from "mongodb";

export const mapperDbRepository = {
    blogOutputMongoDBToBlogViewModel(blogDB: WithId<BlogMongoDBModel>) {
        return {
            id: blogDB._id.toString(),
            name: blogDB.name,
            description: blogDB.description,
            websiteUrl: blogDB.websiteUrl,
            createdAt: blogDB.createdAt,
            isMembership: blogDB.isMembership
        }
    },
    postOutputMongoDBToPostViewModel(postDB: WithId<PostMongoDBModel>) {
        return {
            id: postDB._id.toString(),
            title: postDB.title,
            shortDescription: postDB.shortDescription,
            content: postDB.content,
            blogId: postDB.blogId,
            blogName: postDB.blogName,
            createdAt: postDB.createdAt
        }
    },
    userOutputMongoDBtoUsersViewMongo(userDB: WithId<UsersMongoDBModel>) {
        return {
            id: userDB._id.toString(),
            login: userDB.accountData.login,
            email: userDB.accountData.email,
            createdAt: userDB.accountData.createdAt
        }
    },
    commentViewMongoDBtoCommentViewModel(commentDB: WithId<CommentDBType>) {
        return {
            id: commentDB._id.toString(),
            content: commentDB.content,
            commentatorInfo: {
                userId: commentDB.commentatorInfo.userId,
                userLogin: commentDB.commentatorInfo.userLogin
            },
            createdAt: commentDB.createdAt,
            likesInfo: {
                likesCount: 1,
                dislikesCount: 1,
                myStatus: ''
            }
        }
    },
    deviceAuthSessionsModelToDeviceViewModel(session: DeviceAuthSessionMongoDBModel) {
        return {
            ip: session.IP,
            title: session.deviceName,
            lastActiveDate: session.issuedAt,
            deviceId: session.deviceId
        }
    }
}