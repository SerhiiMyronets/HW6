import {BlogViewMongoDB, CommentViewMongoDB, PostViewMongoDB, UsersViewMongoDB} from "../models/db-models";

export const mapperDbRepository = {
    blogOutputMongoDBToBlogViewModel(blogDB: BlogViewMongoDB) {
        return {
            id: blogDB._id.toString(),
            name: blogDB.name,
            description: blogDB.description,
            websiteUrl: blogDB.websiteUrl,
            createdAt: blogDB.createdAt,
            isMembership: blogDB.isMembership
        }
    },
    postOutputMongoDBToPostViewModel(postDB: PostViewMongoDB) {
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
    userOutputMongoDBtoUsersViewMongo(userDB: UsersViewMongoDB) {
        return {
            id: userDB._id.toString(),
            login: userDB.accountData.login,
            email: userDB.accountData.email,
            createdAt: userDB.accountData.createdAt
        }
    },
    CommentViewMongoDBtoCommentViewModel(commentDB: CommentViewMongoDB) {
        return {
            id: commentDB._id.toString(),
            content: commentDB.content,
            commentatorInfo: {
                userId: commentDB.userId,
                userLogin: commentDB.userLogin
            },
            createdAt: commentDB.createdAt
        }
    }
}