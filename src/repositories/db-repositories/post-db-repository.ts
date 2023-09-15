import {postsCollection} from "../../db/db";
import {ObjectId} from "mongodb";
import {mapperDbRepository} from "../mapper-db-repository";
import {PostInputModel, PostViewModel} from "../../models/repository/posts-models";
import {PostMongoDBModel} from "../../db/db-models";

export const postsRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const result = await postsCollection
            .find()
            .toArray()
        return result.map(b =>
            (mapperDbRepository.postOutputMongoDBToPostViewModel(b)))
    },
    async findById(id: string): Promise<PostViewModel | null> {
        const result = await postsCollection
            .findOne({_id: new ObjectId(id)})
        if (result) {
            return mapperDbRepository.postOutputMongoDBToPostViewModel(result)
        } else {
            return null
        }
    },
    async creatPost(newPostBody: PostMongoDBModel): Promise<PostViewModel | null> {
        const res = await postsCollection
            .insertOne(newPostBody)
        return this.findById(res.insertedId.toString());
    },

    async updatePost(id: string, newUpdatedPostBody: PostInputModel): Promise<Boolean> {
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