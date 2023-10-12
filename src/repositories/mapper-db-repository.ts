import {BlogDBType, CommentDBType, DeviceAuthSessionDBType, PostDBType, UsersBDType} from "../db/db-models";
import {WithId} from "mongodb";

export const mapperDbRepository = {
    blogOutputMongoDBToBlogViewModel(blogDB: WithId<BlogDBType>) {
        return {
            id: blogDB._id.toString(),
            name: blogDB.name,
            description: blogDB.description,
            websiteUrl: blogDB.websiteUrl,
            createdAt: blogDB.createdAt,
            isMembership: blogDB.isMembership
        }
    },
    postOutputMongoDBToPostViewModel(postDB: WithId<PostDBType>) {
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
    userOutputMongoDBtoUsersViewMongo(userDB: WithId<UsersBDType>) {
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
    deviceAuthSessionsModelToDeviceViewModel(session: DeviceAuthSessionDBType) {
        return {
            ip: session.IP,
            title: session.deviceName,
            lastActiveDate: session.issuedAt,
            deviceId: session.deviceId
        }
    }
}