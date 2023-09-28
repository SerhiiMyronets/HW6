import {PostModel} from "../../db/db";
import {mapperDbRepository} from "../mapper-db-repository";
import {PostInputModel, PostViewModel} from "../../models/repository/posts-models";
import {PostMongoDBModel} from "../../db/db-models";

export const postsRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const result = await PostModel
            .find()
        return result.map(b =>
            (mapperDbRepository.postOutputMongoDBToPostViewModel(b)))
    },
    async findById(_id: string): Promise<PostViewModel | null> {
        const result = await PostModel
            .findOne({_id})
        if (result) {
            return mapperDbRepository.postOutputMongoDBToPostViewModel(result)
        } else {
            return null
        }
    },
    async creatPost(newPostBody: PostMongoDBModel): Promise<PostViewModel | null> {
        const res = await PostModel
            .create(newPostBody)
        return this.findById(res.id);
    },

    async updatePost(_id: string, newUpdatedPostBody: PostInputModel): Promise<Boolean> {
        const result = await PostModel
            .updateOne({_id}, {
                $set: newUpdatedPostBody
            })
        return result.matchedCount === 1
    },
    async deletePost(_id: string): Promise<Boolean> {
        const result = await PostModel
            .deleteOne({_id})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        await PostModel
            .deleteMany({})
        return true
    }
}