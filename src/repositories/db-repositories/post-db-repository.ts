import {PostModel} from "../../db/db";
import {PostInputModel, PostViewModel} from "../../models/repository/posts-models";
import {PostDBType} from "../../db/db-models";

export class PostsRepository {
    async findById(_id: string): Promise<PostViewModel | null> {
        return PostModel
            .findOne({_id}, {
                _id: 0,
                id: {$toString: '$_id'},
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }).lean()
    }

    async creatPost(newPostBody: PostDBType): Promise<PostViewModel | null> {
        const res = await PostModel
            .create(newPostBody)
        return this.findById(res.id);
    }

    async updatePost(_id: string, newUpdatedPostBody: PostInputModel): Promise<Boolean> {
        const result = await PostModel
            .updateOne({_id}, {
                $set: newUpdatedPostBody
            })
        return result.matchedCount === 1
    }

    async deletePost(_id: string): Promise<Boolean> {
        const result = await PostModel
            .deleteOne({_id})
        return result.deletedCount === 1
    }

    async deleteAllPosts(): Promise<boolean> {
        await PostModel
            .deleteMany({})
        return true
    }
}