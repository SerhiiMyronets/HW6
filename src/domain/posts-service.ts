import {postsRepository} from "../repositories/post-repository-db";
import {PostCreatClass, PostInputModel, PostViewModel} from "../models/posts-models";
import {blogsRepository} from "../repositories/blogs-repository-db";

export const postsService = {
    async findPosts(): Promise<PostViewModel[]> {
        return postsRepository.findPosts()
    },
    async creatPost(body: PostInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlogById(body.blogId);
        const newPostBody = new PostCreatClass(body, blog!.name)
        return postsRepository.creatPost(newPostBody)
    },
    async findById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findById(id)
    },
    async updatePost(id: string, body: PostInputModel): Promise<Boolean> {
        const blog = await blogsRepository.findBlogById(body.blogId);
        const newUpdatedPostBody = new PostCreatClass(body, blog!.name)
        return postsRepository.updatePost(id, newUpdatedPostBody)
    },
    async deletePost(id: string): Promise<Boolean> {
        return postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsRepository.deleteAllPosts()
    }
}