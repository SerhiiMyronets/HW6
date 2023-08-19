import {Response, Router} from "express";
import {BlogInputModel, findBlogsPaginateModel} from "../models/repository/blogs-models";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery
} from "./request-types";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {blogBodyValidation} from "../midlewares/body/blog-body-validation";
import {paramValidation} from "../midlewares/param/param-validation";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {postsService} from "../domain/posts-service";
import {blogPostBodyValidation} from "../midlewares/body/blog-post-body-validation";
import {blogsQueryValidation} from "../midlewares/query/blogs-query-validation";
import {PostsQueryValidation} from "../midlewares/query/posts-query-validation";
import {findPostsByBlogPaginateModel, PostInputByBlogModel} from "../models/repository/posts-models";

export const blogsRoute = Router({})

blogsRoute.get('/',
    blogsQueryValidation,
    async (req: RequestWithQuery<findBlogsPaginateModel>, res: Response) => {
        const result = await blogsQueryRepository.findBlogsQuery(req.query);
        res.send(result)
    })

blogsRoute.get('/:id',
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const blog = await blogsService.findBlogById(req.params.id)
        if (blog) {
            res.status(200).send(blog)
        } else {
            res.sendStatus(404)
        }
    })
blogsRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const isBlogDeleted = await blogsService.deleteBlog(req.params.id)
        if (isBlogDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
blogsRoute.get('/:id/posts',
    paramValidation,
    ...PostsQueryValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsQuery<{ id: string }, findPostsByBlogPaginateModel>, res: Response) => {
        const isExisting = await blogsQueryRepository.isBlogExisting(req.params.id)
        const result = await blogsQueryRepository.findPostsByBlogIdQuery(req.query, req.params.id)
        if (isExisting) {
            res.status(200).send(result)
        } else {
            res.sendStatus(404)
        }
    })
blogsRoute.post('/',
    authenticationMiddleware,
    blogBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<BlogInputModel>, res: Response) => {
        const blogInputBody: BlogInputModel = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }
        const newBlog = await blogsService.creatBlog(blogInputBody)
        res.status(201).send(newBlog)
    })
blogsRoute.post('/:id/posts',
    authenticationMiddleware,
    paramValidation,
    blogPostBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, PostInputByBlogModel>, res: Response) => {
        const isExisting = await blogsQueryRepository.isBlogExisting(req.params.id)
        if (isExisting) {
            const newPost = await postsService.creatPost(
                req.body.title, req.body.shortDescription,
                req.body.content, req.params.id)
            res.status(201).send(newPost)
        } else {
            res.sendStatus(404)
        }
    })
blogsRoute.put('/:id',
    authenticationMiddleware,
    paramValidation,
    blogBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, BlogInputModel>, res: Response) => {
        const isBlogUpdated = await blogsService.updateBlog(
            req.params.id, req.body.name,
            req.body.description, req.body.websiteUrl)
        if (isBlogUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
