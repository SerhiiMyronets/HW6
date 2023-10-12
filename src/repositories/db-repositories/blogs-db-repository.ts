import {BlogModel} from "../../db/db";
import {mapperDbRepository} from "../mapper-db-repository";
import {BlogInputModel, BlogViewModel} from "../../models/repository/blogs-models";
import {BlogDBType} from "../../db/db-models";

export class BlogsDBRepository {
    async findBlogs(): Promise<BlogViewModel[]> {
        const result = await BlogModel
            .find()
        return result.map(b =>
            (mapperDbRepository.blogOutputMongoDBToBlogViewModel(b)))
    }
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const result = await BlogModel
            .findOne({_id: id})
        if (result) {
            return mapperDbRepository.blogOutputMongoDBToBlogViewModel(result)
        } else {
            return null
        }
    }
    async creatBlog(newBlogBody: BlogDBType): Promise<BlogViewModel | null> {
        const res = await BlogModel
            .create(newBlogBody)
        return this.findBlogById(res.id);
    }
    async updateBlog(_id: string, newUpdatedBlogBody: BlogInputModel): Promise<Boolean> {
        const result = await BlogModel
            .updateOne({_id}, {
                $set: newUpdatedBlogBody
            })
        return result.matchedCount === 1
    }
    async deleteBlog(_id: string): Promise<Boolean> {
        const result = await BlogModel
            .deleteOne({_id})
        return result.deletedCount === 1
    }
    async deleteAllBlogs(): Promise<Boolean> {
        await BlogModel
            .deleteMany({})
        return true
    }
}