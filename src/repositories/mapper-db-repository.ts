import {
    BlogMongoDBModel,
    CommentMongoDBModel,
    DeviceAuthSessionsModel,
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
            createdAt: blogDB.createdAt.toISOString(),
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
            createdAt: postDB.createdAt.toISOString()
        }
    },
    userOutputMongoDBtoUsersViewMongo(userDB: WithId<UsersMongoDBModel>) {
        return {
            id: userDB._id.toString(),
            login: userDB.accountData.login,
            email: userDB.accountData.email,
            createdAt: userDB.accountData.createdAt.toISOString()
        }
    },
    commentViewMongoDBtoCommentViewModel(commentDB: WithId<CommentMongoDBModel>) {
        return {
            id: commentDB._id.toString(),
            content: commentDB.content,
            commentatorInfo: {
                userId: commentDB.userId,
                userLogin: commentDB.userLogin
            },
            createdAt: commentDB.createdAt.toISOString()
        }
    },
    deviceAuthSessionsModelToDeviceViewModel(session: DeviceAuthSessionsModel) {
        return {
            ip: session.IP,
            title: session.deviceName,
            lastActiveDate: session.issuedAt.toISOString(),
            deviceId: session.deviceId
        }
    }
}