import {
    PostInputModel, PostInputMongoDB,
    PostOutputMongoDB, PostViewModel
} from "../../models/posts-models";
import {postsCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findPosts(): Promise<PostViewModel[]> {
        const result = await postsCollection
            .find()
            .toArray()
        return result.map(b =>
            (this._mapPostInputModelToPostViewModel(b)))
    },
    async creatPost(newPostBody: PostInputMongoDB): Promise<PostViewModel | null> {
        const res = await postsCollection
            .insertOne(newPostBody)
        return this.findById(res.insertedId.toString());
    },
    async findById(id: string): Promise<PostViewModel | null> {
        const result = await postsCollection
            .findOne({_id: new ObjectId(id)})
        if (result) {
            return this._mapPostInputModelToPostViewModel(result)
        } else {
            return null
        }
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
    },
    _mapPostInputModelToPostViewModel(postDB: PostOutputMongoDB) {
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