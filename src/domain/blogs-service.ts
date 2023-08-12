import {blogsRepository} from "../repositories/blogs-repository-db";
import {CreatBlogClass, BlogInputModel, BlogViewModel, UpdateBlogClass} from "../models/blogs-models";

export const blogsService = {
    async findBlogs(): Promise<BlogViewModel[]> {
        return blogsRepository.findBlogs()
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogById(id)
    },
    async creatBlog(body: BlogInputModel): Promise<BlogViewModel | null> {
        const newBlogBody = new CreatBlogClass(body)
        return blogsRepository.creatBlog(newBlogBody)
    },

    async updateBlog(id: string, body: BlogInputModel): Promise<Boolean> {
        const newUpdatedBlogBody = new UpdateBlogClass(body)
        return blogsRepository.updateBlog(id, newUpdatedBlogBody)
    },
    async deleteBlog(id: string): Promise<Boolean> {
        return blogsRepository.deleteBlog(id)

    },
    async deleteAllBlogs(): Promise<Boolean> {
        return blogsRepository.deleteAllBlogs()
    }
}