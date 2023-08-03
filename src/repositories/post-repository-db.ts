import {generateString} from "../functions/generate-string";
import {PostInputModel, PostViewModel} from "../models/posts-models";
import {blogsRepository} from "./blogs-repository-db";
import {client} from "../db/db";


/*const posts: PostViewModel[] = [{
    id: "string",
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "1",
    blogName: "Name"
}]*/

export const postsRepository = {
    async getAllPosts(): Promise<PostInputModel[]> {
        return await client.db("social_media").collection<PostViewModel>("posts")
            .find({}).toArray()
    },
    async creatPost(body: PostInputModel): Promise<PostInputModel> {
        const {title, shortDescription, content, blogId} = body
        const blog = await blogsRepository.getBlogById(blogId);
        const newPost: PostViewModel = {
            id: generateString(5),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }
        await client.db("social_media").collection<PostViewModel>("posts")
            .insertOne(newPost)
        return newPost;
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        return await client.db("social_media").collection<PostViewModel>("posts")
            .findOne({id: id})
    },
    async updatePost(id: string, body: PostInputModel): Promise<Boolean> {
        const {title, shortDescription, content, blogId} = body
        const blog = await blogsRepository.getBlogById(blogId);
        const result = await client.db("social_media").collection<PostViewModel>("posts")
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
        const result = await client.db("social_media").collection<PostViewModel>("posts")
            .deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        await client.db("social_media").collection<PostViewModel>("posts")
            .deleteMany({})
        return true
    }
}