import {
    BlogInputModel,
    BlogCreatClass,
    BlogViewClass,
    BlogViewModel, BlogUpdateClass,

} from "../models/blogs-models";
import {blogsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        const result = await blogsCollection
            .find()
            .toArray()
        return result.map(b => (new BlogViewClass(b)))
    },
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const result = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        if (result) {
            return new BlogViewClass(result)
        } else {
            return null
        }
    },
    async creatBlog(body: BlogInputModel): Promise<BlogViewModel | null> {
        const res = await blogsCollection
            .insertOne(new BlogCreatClass(body))
        return this.getBlogById(res.insertedId.toString());
    },

    async updateBlog(id: string, body: BlogInputModel): Promise<Boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection
            .updateOne({_id: new ObjectId(id)}, {
                $set: new BlogUpdateClass(body)
            })
        return result.modifiedCount === 1
    },
    async deleteBlog(id: string): Promise<Boolean> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const result = await blogsCollection
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<Boolean> {
        await blogsCollection
            .deleteMany({})
        return true
    }
}