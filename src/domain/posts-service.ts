import {PostInputModel, PostViewModel} from "../models/repository/posts-models";
import {postsRepository} from "../repositories/db-repositories/post-db-repository";
import {blogsRepository} from "../repositories/db-repositories/blogs-db-repository";


export const postsService = {
    async findPosts(): Promise<PostViewModel[]> {
        return postsRepository.findPosts()
    },
    async creatPost(body: PostInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlogById(body.blogId);
        const newPostBody = this._createNewPostBody(body, blog!.name)
        return postsRepository.creatPost(newPostBody)
    },
    async findById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findById(id)
    },
    async updatePost(id: string, body: PostInputModel): Promise<Boolean> {
        const blog = await blogsRepository.findBlogById(body.blogId);
        const newUpdatedPostBody = this._createNewPostBodyToUpdate(body, blog!.name)
        return postsRepository.updatePost(id, newUpdatedPostBody)
    },
    async deletePost(id: string): Promise<Boolean> {
        return postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsRepository.deleteAllPosts()
    },
    _createNewPostBody(body: PostInputModel, blogName: string) {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
    },
    _createNewPostBodyToUpdate(body: PostInputModel, blogName: string) {
        return {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
        }
    }
}