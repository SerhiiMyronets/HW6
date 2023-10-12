import {Router} from "express";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {blogBodyValidation} from "../midlewares/body/blog-body-validation";
import {paramValidation} from "../midlewares/param/param-validation";
import {blogPostBodyValidation} from "../midlewares/body/blog-post-body-validation";
import {blogsQueryValidation} from "../midlewares/query/blogs-query-validation";
import {postsQueryValidation} from "../midlewares/query/posts-query-validation";
import {blogController} from "../composition-root";


export const blogsRoute = Router({})



blogsRoute.get('/',
    blogsQueryValidation,
    blogController.getBlogs.bind(blogController))

blogsRoute.get('/:id',
    paramValidation,
    errorsFormatMiddleware,
    blogController.getBlog.bind(blogController))

blogsRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    blogController.deleteBlog.bind(blogController))

blogsRoute.get('/:id/posts',
    paramValidation,
    postsQueryValidation,
    errorsFormatMiddleware,
    blogController.getPostsByBlog.bind(blogController))

blogsRoute.post('/',
    authenticationMiddleware,
    blogBodyValidation,
    errorsFormatMiddleware,
    blogController.createBlog.bind(blogController))

blogsRoute.post('/:id/posts',
    authenticationMiddleware,
    paramValidation,
    blogPostBodyValidation,
    errorsFormatMiddleware,
    blogController.createPostByBlog.bind(blogController))

blogsRoute.put('/:id',
    authenticationMiddleware,
    paramValidation,
    blogBodyValidation,
    errorsFormatMiddleware,
    blogController.updateBlog.bind(blogController))