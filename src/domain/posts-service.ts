import {PostInputModel, PostUpdateInputModel, PostViewModel} from "../models/repository/posts-models";
import {PostsDBRepository} from "../repositories/db-repositories/post-db-repository";

import {LikeInfoType, PostDBType} from "../db/db-models";
import {BlogsDBRepository} from "../repositories/db-repositories/blogs-db-repository";
import {LikesInfoDbRepository} from "../repositories/db-repositories/likes-info-db-repository";
import {likesInfoDBRepository} from "../composition-root";


export class PostsService {
    constructor(protected postsDBRepository: PostsDBRepository,
                protected blogsRepository: BlogsDBRepository,
                protected likesInfoDbRepository: LikesInfoDbRepository) {
    }

    async creatPost(postInputBody: PostInputModel): Promise<PostViewModel | null> {
        const blog = await this.blogsRepository.findBlogById(postInputBody.blogId);
        const newPost = new PostDBType(
            postInputBody.title,
            postInputBody.shortDescription,
            postInputBody.content,
            postInputBody.blogId,
            blog!.name)
        return this.postsDBRepository.creatPost(newPost)
    }

    async findById(id: string): Promise<PostViewModel | null> {
        return this.postsDBRepository.findById(id)
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
        return this.postsDBRepository.updatePost(postUpdateInputBody.postId, newUpdatedPostBody)
    }

    async deletePost(id: string): Promise<Boolean> {
        return this.postsDBRepository.deletePost(id)
    }

    async deleteAllPosts(): Promise<boolean> {
        return this.postsDBRepository.deleteAllPosts()
    }

    async postLikeStatusUpdate(userId: string, userLogin: string, likeObjectId: string,
                               likeStatus: string): Promise<boolean> {
        let likeInfo = await this.likesInfoDbRepository.findLikeInfo(
            userId, 'post', likeObjectId)
        const post = await this.postsDBRepository.findById(likeObjectId)
        if (!likeInfo) {
            const newLikeInfo = new LikeInfoType(userId, userLogin, 'post',
                likeObjectId, 'blog', post!.blogId, likeStatus)
            await this.likesInfoDbRepository.addLikeInfo(newLikeInfo)
            if (likeStatus === 'Like')
                await this.postsDBRepository.increaseLikesCount(likeObjectId)
            if (likeStatus === 'Dislike')
                await this.postsDBRepository.increaseDislikeCount(likeObjectId)
        } else {
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Like') {
                await this.likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await this.postsDBRepository.increaseLikesCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'Like') {
                await this.likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await this.postsDBRepository.increaseLikesAndDecreaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Dislike') {
                await this.likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await this.postsDBRepository.increaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'Dislike') {
                await this.likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await this.postsDBRepository.increaseDislikeAndDecreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'None') {
                await this.likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await this.postsDBRepository.decreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'None') {
                await this.likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await this.postsDBRepository.decreaseDislikeCount(likeObjectId)
            }
        }
        const newestThreeLikesInfo = await likesInfoDBRepository
            .findNewestThreeLikes(likeObjectId)
        if (newestThreeLikesInfo)
            await this.postsDBRepository.addNewestLike(likeObjectId, newestThreeLikesInfo)
        return true
    }
}
