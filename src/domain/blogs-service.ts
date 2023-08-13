import {BlogInputModel, BlogViewModel} from "../models/blogs-models";
import {blogsRepository} from "../repositories/db-repositories/blogs-db-repository";

export const blogsService = {
    async findBlogs(): Promise<BlogViewModel[]> {
        return blogsRepository.findBlogs()
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogById(id)
    },
    async creatBlog(body: BlogInputModel): Promise<BlogViewModel | null> {
        const newBody = this._creatNewBlogBody(body)
        return blogsRepository.creatBlog(newBody)
    },
    async updateBlog(id: string, body: BlogInputModel): Promise<Boolean> {
        return blogsRepository.updateBlog(id, body)
    },
    async deleteBlog(id: string): Promise<Boolean> {
        return blogsRepository.deleteBlog(id)
    },
    async deleteAllBlogs(): Promise<Boolean> {
        return blogsRepository.deleteAllBlogs()
    },
    _creatNewBlogBody(body: BlogInputModel) {
        return {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
    }
}