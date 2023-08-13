import {Response, Router} from "express";
import {BlogInputModel, BlogPostInputModel} from "../models/blogs-models";
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
import {findBlogsQueryModel, findPostsByIdQueryModel} from "../models/find-blogs-query-model";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {postsService} from "../domain/posts-service";
import {blogPostBodyValidation} from "../midlewares/body/blog-post-body-validation";
import {blogQueryValidation} from "../midlewares/query/blog-query-validation";
import {PostQueryValidation} from "../midlewares/query/post-query-validation";

export const blogsRoute = Router({})

//QUERY
blogsRoute.get('/',
    blogQueryValidation,
    async (req: RequestWithQuery<findBlogsQueryModel>, res: Response) => {
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
    errorsFormatMiddleware,
    PostQueryValidation,
    // @ts-ignore
    async (req: RequestWithParamsQuery<{ id: string }, findPostsByIdQueryModel>, res: Response) => {
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
        const newBlog = await blogsService.creatBlog(req.body)
        res.status(201).send(newBlog)
    })
blogsRoute.post('/:id/posts',
    authenticationMiddleware,
    paramValidation,
    blogPostBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, BlogPostInputModel>, res: Response) => {
        const isExisting = await blogsQueryRepository.isBlogExisting(req.params.id)
        if (isExisting) {
            const newBlog = await postsService.creatPost({...req.body, blogId: req.params.id})
            res.status(201).send(newBlog)
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
        const isBlogUpdated = await blogsService.updateBlog(req.params.id, req.body)
        if (isBlogUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })