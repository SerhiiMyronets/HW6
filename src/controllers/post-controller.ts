import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery
} from "../types/request-types";
import {FindPostsPaginateModel, PostInputModel, PostUpdateInputModel} from "../models/repository/posts-models";
import {Response} from "express";
import {PostsQueryRepository,} from "../repositories/query-repositories/posts-query-repository";
import {PostsService,} from "../domain/posts-service";
import {
    CommentInputModel,
    FindCommentsPaginateModel,
    LikesStatusQueryModel
} from "../models/repository/comments-models";
import {CommentsService} from "../domain/comments-service";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {LikesInfoQueryRepository} from "../repositories/query-repositories/likes-info-query-repository";


export class PostController {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected likesInfoQueryRepository: LikesInfoQueryRepository) {
    }

    async getPosts(req: RequestWithQuery<FindPostsPaginateModel>, res: Response) {
        const result = await this.postsQueryRepository.findPostsQuery(req.query);
        res.send(result)
    }

    async getPost(req: RequestWithParams<{ id: string }>, res: Response) {
        const post = await this.postsService.findById(req.params.id)
        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async deletePost(req: RequestWithParams<{ id: string }>, res: Response) {
        const isPostDeleted = await this.postsService.deletePost(req.params.id)
        if (isPostDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async createPost(req: RequestWithBody<PostInputModel>, res: Response) {
        const postInputBody: PostInputModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        const newPost = await this.postsService.creatPost(postInputBody)
        res.status(201).send(newPost)
    }

    async updatePost(req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) {
        const postUpdateInputBody: PostUpdateInputModel = {
            postId: req.params.id,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        const isPostUpdated = await this.postsService.updatePost(postUpdateInputBody)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async createCommentByPost(req: RequestWithParamsBody<{ id: string }, CommentInputModel>, res: Response) {
        if (await this.postsQueryRepository.isPostExisting(req.params.id)) {
            const [postId, content, userId, userLogin] =
                [req.params.id, req.body.content, req.user!._id.toString(), req.user!.accountData.login]
            const newCommentId = await this.commentsService
                .createComment(postId, content, userId, userLogin)
            const comment = await this.commentsQueryRepository.findCommentById(newCommentId)
            res.status(201).send(comment)
        } else {
            res.sendStatus(404)
        }
    }

    async getCommentsByPost(req: RequestWithParamsQuery<{ id: string }, FindCommentsPaginateModel>, res: Response) {
        const postId = req.params.id
        const userId = req.user?._id.toString()
        const isPostExisting = await this.postsQueryRepository.isPostExisting(postId)
        if (!isPostExisting)
            res.sendStatus(404)
        let likesStatus: LikesStatusQueryModel = []
        if (userId) {
            likesStatus = await this.likesInfoQueryRepository.getCommentsLikeStatusByPost(postId, userId)
        }
        const result = await this.commentsQueryRepository.findCommentsByPostId(req.query, postId, likesStatus)
        res.status(200).send(result)
    }
}