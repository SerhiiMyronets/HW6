import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery
} from "../types/request-types";
import {BlogInputModel, findBlogsPaginateModel} from "../models/repository/blogs-models";
import {Response} from "express";
import {BlogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {BlogsService} from "../domain/blogs-service";
import {FindPostsPaginateModel, PostInputByBlogModel, PostInputModel} from "../models/repository/posts-models";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {injectable} from "inversify";
import {LikesStatusQueryModel} from "../models/repository/comments-models";
import {LikesInfoQueryRepository} from "../repositories/query-repositories/likes-info-query-repository";

@injectable()
export class BlogsController {
    constructor(protected blogsQueryRepository: BlogsQueryRepository,
                protected blogsService: BlogsService,
                protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                protected likesInfoQueryRepository: LikesInfoQueryRepository) {
    }

    async getBlogs(req: RequestWithQuery<findBlogsPaginateModel>, res: Response) {
        const result = await this.blogsQueryRepository.findBlogsQuery(req.query);
        res.send(result)
    }

    async getBlog(req: RequestWithParams<{ id: string }>, res: Response) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteBlog(req: RequestWithParams<{ id: string }>, res: Response) {
        const isBlogDeleted = await this.blogsService.deleteBlog(req.params.id)
        if (isBlogDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async getPostsByBlog(req: RequestWithParamsQuery<{ id: string }, FindPostsPaginateModel>, res: Response) {
        const blogId = req.params.id
        const userId = req.user?._id.toString()
        const isBlogExisting = await this.blogsQueryRepository.isBlogExisting(blogId)
        if (!isBlogExisting)
            res.sendStatus(404)
        let likesStatus: LikesStatusQueryModel = []
        if (userId) {
            likesStatus = await this.likesInfoQueryRepository.getPostsLikeStatusByBlog(blogId, userId)
        }
        const result = await this.postsQueryRepository.findPostsByBlogIdQuery(req.query, blogId, likesStatus)
        res.status(200).send(result)


    }

    async createBlog(req: RequestWithBody<BlogInputModel>, res: Response) {
        const blogInputBody: BlogInputModel = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }
        const newBlog = await this.blogsService.creatBlog(blogInputBody)
        res.status(201).send(newBlog)
    }

    async createPostByBlog(req: RequestWithParamsBody<{ id: string }, PostInputByBlogModel>, res: Response) {
        const isBlogExisting = await this.blogsQueryRepository.isBlogExisting(req.params.id)
        if (isBlogExisting) {
            const postInputBody: PostInputModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.params.id
            }
            const newPostId = await this.postsService.creatPost(postInputBody)
            const post = await this.postsQueryRepository.findPostById(newPostId)
            res.status(201).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async updateBlog(req: RequestWithParamsBody<{ id: string }, BlogInputModel>, res: Response) {
        const isBlogUpdated = await this.blogsService.updateBlog(
            req.params.id, req.body.name,
            req.body.description, req.body.websiteUrl)
        if (isBlogUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}