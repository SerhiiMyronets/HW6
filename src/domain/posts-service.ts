import {PostViewModel} from "../models/repository/posts-models";
import {postsRepository} from "../repositories/db-repositories/post-db-repository";
import {blogsRepository} from "../repositories/db-repositories/blogs-repository";


export const postsService = {
    async findPosts(): Promise<PostViewModel[]> {
        return postsRepository.findPosts()
    },
    async creatPost(
        title: string, shortDescription: string,
        content: string, blogId: string): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlogById(blogId);
        const newPostBody = this._createNewPostBody(title, shortDescription, content, blogId, blog!.name)
        return postsRepository.creatPost(newPostBody)
    },
    async findById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findById(id)
    },
    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, blogId: string): Promise<Boolean> {
        const blog = await blogsRepository.findBlogById(blogId);
        const newUpdatedPostBody = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }
        return postsRepository.updatePost(id, newUpdatedPostBody)
    },
    async deletePost(id: string): Promise<Boolean> {
        return postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsRepository.deleteAllPosts()
    },
    _createNewPostBody(title: string, shortDescription: string,
                       content: string, blogId: string, blogName: string) {
        return {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
    }
}
