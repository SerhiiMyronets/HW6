import {BlogOutputMongoDB, PostViewMongoDB} from "../models/db-models";

export const mapperRepository = {
    blogOutputMongoDBToBlogViewModel(blogDB: BlogOutputMongoDB) {
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
    }
}