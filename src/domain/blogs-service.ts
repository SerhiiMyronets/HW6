import {BlogInputModel, BlogViewModel} from "../models/repository/blogs-models";
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
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<Boolean> {
        const UpdatedBlogBody = {
            name,
            description,
            websiteUrl
        }
        return blogsRepository.updateBlog(id, UpdatedBlogBody)
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