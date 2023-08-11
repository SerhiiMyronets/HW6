import {Request, Response, Router} from "express";
import {BlogInputModel} from "../models/blogs-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {ErrorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {blogBodyValidation} from "../midlewares/blog-body-validation";

export const blogsRoute = Router({})

blogsRoute.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs();
    res.send(blogs)
})
blogsRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = await blogsRepository.getBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})
blogsRoute.delete('/:id', authenticationMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isBlogDeleted = await blogsRepository.deleteBlog(req.params.id)
    if (isBlogDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
blogsRoute.post('/',
    authenticationMiddleware,
    blogBodyValidation,
    ErrorsFormatMiddleware, async (req: RequestWithBody<BlogInputModel>, res: Response) => {
        const newBlog = await blogsRepository.creatBlog(req.body)
        res.status(201).send(newBlog)
    })
blogsRoute.put('/:id',
    authenticationMiddleware,
    blogBodyValidation,
    ErrorsFormatMiddleware, async (req: RequestWithParamsBody<{ id: string }, BlogInputModel>, res: Response) => {
        const isBlogUpdated = await blogsRepository.updateBlog(req.params.id, req.body)
        if (isBlogUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })