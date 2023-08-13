import {Request, Response, Router} from "express";
import {BlogInputModel} from "../models/blogs-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {blogBodyValidation} from "../midlewares/blog-body-validation";
import {paramValidation} from "../midlewares/param-validation";
import {blogsService} from "../domain/blogs-service";
export const blogsRoute = Router({})

blogsRoute.get('/',
    async (req: Request, res: Response) => {
        const blogs = await blogsService.findBlogs();
        res.send(blogs)
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
blogsRoute.post('/',
    authenticationMiddleware,
    blogBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<BlogInputModel>, res: Response) => {
        const newBlog = await blogsService.creatBlog(req.body)
        res.status(201).send(newBlog)
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