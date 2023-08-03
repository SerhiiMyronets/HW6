import {generateString} from "../functions/generate-string";
import {PostInputModel, PostViewModel} from "../models/posts-models";
import {blogsRepository} from "./blogs-repository-db";
import {postsCollection} from "../db/db";




/*const posts: PostViewModel[] = [{
    id: "string",
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "1",
    blogName: "Name"
}]*/

export const postsRepository = {
    async getAllPosts(): Promise<PostViewModel[]> {
        return await postsCollection
            .find({})
            .project<PostViewModel>({_id: 0})
            .toArray()
    },
    async creatPost(body: PostInputModel): Promise<PostViewModel> {
        const {title, shortDescription, content, blogId} = body
        const blog = await blogsRepository.getBlogById(blogId);
        const newPost: PostViewModel = {
            id: generateString(5),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        await postsCollection
            .insertOne(newPost)
        return newPost;
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        return await postsCollection
            .findOne({id: id}, { projection: {_id: 0}} )

    },
    async updatePost(id: string, body: PostInputModel): Promise<Boolean> {
        const {title, shortDescription, content, blogId} = body
        const blog = await blogsRepository.getBlogById(blogId);
        const result = await postsCollection
            .updateOne({id: id}, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: blog!.name
                }
            })
        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<Boolean> {
        const result = await postsCollection
            .deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        await postsCollection
            .deleteMany({})
        return true
    }
}