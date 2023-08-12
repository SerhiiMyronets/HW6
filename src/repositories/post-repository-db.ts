import {
    PostCreatClass,
    PostUpdateClass,
    PostViewClass,
    PostViewModel
} from "../models/posts-models";
import {postsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const result = await postsCollection
            .find()
            .toArray()
        return result.map(b=> (new PostViewClass(b)))
    },
    async creatPost(newPostBody: PostCreatClass): Promise<PostViewModel | null> {
        const res = await postsCollection
            .insertOne(newPostBody)
        return this.findById(res.insertedId.toString());
    },
    async findById(id: string): Promise<PostViewModel | null> {
        const result = await postsCollection
            .findOne({_id: new ObjectId(id)} )
        if (result) {
            return new PostViewClass(result)
        } else {
            return null
        }
    },
    async updatePost(id: string, newUpdatedPostBody: PostUpdateClass): Promise<Boolean> {
        const result = await postsCollection
            .updateOne({_id: new ObjectId(id)}, {
                $set: newUpdatedPostBody
            })
        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<Boolean> {
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