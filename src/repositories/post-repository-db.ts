
import {PostCreatClass, PostInputModel, PostUpdateClass, PostViewClass, PostViewModel} from "../models/posts-models";
import {blogsRepository} from "./blogs-repository-db";
import {postsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async getAllPosts(): Promise<PostViewModel[]> {
        const result = await postsCollection
            .find()
            .toArray()
        return result.map(b=> (new PostViewClass(b)))
    },
    async creatPost(body: PostInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.getBlogById(body.blogId);
        const res = await postsCollection
            .insertOne(new PostCreatClass(body, blog!.name))
        return this.getPostById(res.insertedId.toString());
    },
    async getPostById(id: string): Promise<PostViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await postsCollection
            .findOne({_id: new ObjectId(id)} )
        if (result) {
            return new PostViewClass(result)
        } else {
            return null
        }

    },
    async updatePost(id: string, body: PostInputModel): Promise<Boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsRepository.getBlogById(body.blogId);
        const result = await postsCollection
            .updateOne({_id: new ObjectId(id)}, {
                $set: new PostUpdateClass(body, blog!.name)
            })
        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<Boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await postsCollection
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        await postsCollection
            .deleteMany({})
        return true
    }
}