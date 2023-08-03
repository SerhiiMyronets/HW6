import {generateString} from "../functions/generate-string";
import {BlogInputModel, BlogViewModel} from "../models/blogs-models";
import {client} from "../db/db";

/*const blogs: BlogViewModel[] = [{
    id: "1",
    name: "Name",
    description: "Description",
    websiteUrl: "WebsiteUrl.com"
}]*/

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        return await client.db("social_media").collection<BlogViewModel>("blogs")
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
        await client.db("social_media").collection<BlogViewModel>("blogs")
            .insertOne(newBlog)
        return newBlog;
    },
    async getBlogById(id: string): Promise<BlogViewModel | null> {
        return await client.db("social_media").collection<BlogViewModel>("blogs")
            .findOne({id: id})
    },
    async updateBlog(id: string, body: BlogInputModel): Promise<Boolean> {
        const {name, description, websiteUrl} = body
        const result = await client.db("social_media").collection<BlogViewModel>("blogs")
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
        const result = await client.db("social_media").collection<BlogViewModel>("blogs")
            .deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<Boolean> {
        await client.db("social_media").collection<BlogViewModel>("blogs")
            .deleteMany({})
        return true
    }
}