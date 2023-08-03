import {generateString} from "../functions/generate-string";
import {BlogInputModel, BlogViewModel} from "../models/blogs-models";
import {blogsCollection} from "../db/db";


/*const blogs: BlogViewModel[] = [{
    id: "1",
    name: "Name",
    description: "Description",
    websiteUrl: "WebsiteUrl.com"
}]*/

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        return await blogsCollection
            .find().toArray()
    },

    async creatBlog(body: BlogInputModel): Promise<BlogViewModel> {
        const {name, description, websiteUrl} = body
        const newBlog: BlogViewModel = {
            id: generateString(5),
            name,
            description,
            websiteUrl
        }
        await blogsCollection
            .insertOne(newBlog)
        return newBlog;
    },
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection
            .findOne({id: id})
    },
    async updateBlog(id: string, body: BlogInputModel): Promise<Boolean> {
        const {name, description, websiteUrl} = body
        const result = await blogsCollection
            .updateOne({id: id}, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl
                }
            })
        return result.modifiedCount === 1
    },
    async deleteBlog(id: string): Promise<Boolean> {
        const result = await blogsCollection
            .deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<Boolean> {
        await blogsCollection
            .deleteMany({})
        return true
    }
}