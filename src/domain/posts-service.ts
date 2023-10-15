import {PostInputModel, PostUpdateInputModel, PostViewModel} from "../models/repository/posts-models";
import {PostsRepository} from "../repositories/db-repositories/post-db-repository";

import {PostDBType} from "../db/db-models";
import {BlogsDBRepository} from "../repositories/db-repositories/blogs-db-repository";


export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected blogsRepository: BlogsDBRepository) {
    }
    async creatPost(postInputBody: PostInputModel): Promise<PostViewModel | null> {
        const blog = await this.blogsRepository.findBlogById(postInputBody.blogId);
        const newPost = new PostDBType(
            postInputBody.title,
            postInputBody.shortDescription,
            postInputBody.content,
            postInputBody.blogId,
            blog!.name)
        return this.postsRepository.creatPost(newPost)
    }
    async findById(id: string): Promise<PostViewModel | null> {
        return this.postsRepository.findById(id)
    }
    async updatePost(postUpdateInputBody: PostUpdateInputModel): Promise<Boolean> {
        const blog = await this.blogsRepository.findBlogById(postUpdateInputBody.blogId);
        const newUpdatedPostBody = {
            title: postUpdateInputBody.title,
            shortDescription: postUpdateInputBody.shortDescription,
            content: postUpdateInputBody.content,
            blogId: postUpdateInputBody.blogId,
            blogName: blog!.name
        }
        return this.postsRepository.updatePost(postUpdateInputBody.postId, newUpdatedPostBody)
    }
    async deletePost(id: string): Promise<Boolean> {
        return this.postsRepository.deletePost(id)
    }
    async deleteAllPosts(): Promise<boolean> {
        return this.postsRepository.deleteAllPosts()
    }
}
