import {PostModel} from "../../db/db";
import {newestLikesViewModel, PostInputModel, PostViewModel} from "../../models/repository/posts-models";
import {PostDBType} from "../../db/db-models";
import {ObjectId} from "mongodb";

export class PostsDBRepository {
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

    async creatPost(newPostBody: PostDBType): Promise<string> {
        const res = await PostModel
            .create(newPostBody)
        return res.id;
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

    async increaseLikesCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.likesCount': 1}})
    }

    async increaseLikesAndDecreaseDislikeCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.likesCount': 1, 'extendedLikesInfo.dislikesCount': -1}})
    }

    async increaseDislikeCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.dislikesCount': 1}})
    }

    async increaseDislikeAndDecreaseLikeCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.likesCount': -1, 'extendedLikesInfo.dislikesCount': 1}})
    }

    async decreaseLikeCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.likesCount': -1}})
    }

    async decreaseDislikeCount(id: string) {
        await PostModel.findOneAndUpdate({_id: new ObjectId(id)},
            {$inc: {'extendedLikesInfo.dislikesCount': -1}})
    }

    async addNewestLike(likeObjectId: string, newestThreeLikesInfo: newestLikesViewModel[]) {
        const post = await PostModel.findById(likeObjectId)
        post!.extendedLikesInfo.newestLikes = newestThreeLikesInfo
        post!.save()
    }
}