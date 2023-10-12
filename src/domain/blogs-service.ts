import {BlogInputModel} from "../models/repository/blogs-models";
import {BlogDBType} from "../db/db-models";
import {BlogsDBRepository} from "../repositories/db-repositories/blogs-db-repository";


export class BlogsService {
    constructor(protected blogsRepository: BlogsDBRepository) {
    }
    async creatBlog(body: BlogInputModel): Promise<BlogDBType | null> {
        const newBlog = new BlogDBType(
            body.name,
            body.description,
            body.websiteUrl
        )
        return this.blogsRepository.creatBlog(newBlog)
    }
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<Boolean> {
        const UpdatedBlogBody = {
            name,
            description,
            websiteUrl
        }
        return this.blogsRepository.updateBlog(id, UpdatedBlogBody)
    }
    async deleteBlog(id: string): Promise<Boolean> {
        return this.blogsRepository.deleteBlog(id)
    }
    async deleteAllBlogs(): Promise<Boolean> {
        return this.blogsRepository.deleteAllBlogs()
    }
}