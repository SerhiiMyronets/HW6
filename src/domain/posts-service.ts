import {PostInputModel, PostUpdateInputModel, PostViewModel} from "../models/repository/posts-models";
import {postsRepository} from "../repositories/db-repositories/post-db-repository";
import {blogsRepository} from "../repositories/db-repositories/blogs-db-repository";




export const postsService = {
    async findPosts(): Promise<PostViewModel[]> {
        return postsRepository.findPosts()
    },
    async creatPost(postInputBody: PostInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.findBlogById(postInputBody.blogId);
        const newPostBody = {
            title: postInputBody.title,
            shortDescription: postInputBody.shortDescription,
            content: postInputBody.content,
            blogId: postInputBody.blogId,
            blogName: blog!.name,
            createdAt: new Date()
        }
        return postsRepository.creatPost(newPostBody)
    },
    async findById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findById(id)
    },
    async updatePost(postUpdateInputBody: PostUpdateInputModel): Promise<Boolean> {
        const blog = await blogsRepository.findBlogById(postUpdateInputBody.blogId);
        const newUpdatedPostBody = {
            title: postUpdateInputBody.title,
            shortDescription: postUpdateInputBody.shortDescription,
            content: postUpdateInputBody.content,
            blogId: postUpdateInputBody.blogId,
            blogName: blog!.name
        }
        return postsRepository.updatePost(postUpdateInputBody.postId, newUpdatedPostBody)
    },
    async deletePost(id: string): Promise<Boolean> {
        return postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsRepository.deleteAllPosts()
    }
}
