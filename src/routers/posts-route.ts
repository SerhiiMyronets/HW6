import {Router} from "express";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {postBodyValidation} from "../midlewares/body/posts-body-validation";
import {paramValidation} from "../midlewares/param/param-validation";
import {postsQueryValidation} from "../midlewares/query/posts-query-validation";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {commentsQueryValidation} from "../midlewares/query/comments-query-validation";
import {accessTokenNonProtectedMiddleware} from "../midlewares/access-token-non-protected-middleware";
import {postController} from "../composition-root";
import {likeInputValidation} from "../midlewares/body/like-input-validation";


export const postsRoute = Router({})




postsRoute.get('/',
    accessTokenNonProtectedMiddleware,
    postsQueryValidation,
    postController.getPosts.bind(postController))

postsRoute.get('/:id',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    postController.getPost.bind(postController))

postsRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    postController.deletePost.bind(postController))

postsRoute.put('/:id/like-status',
    accessTokenMiddlewareProtected,
    paramValidation,
    likeInputValidation,
    errorsFormatMiddleware,
    postController.postLikeStatusUpdate.bind(postController))

postsRoute.post('/',
    authenticationMiddleware,
    postBodyValidation,
    errorsFormatMiddleware,
    postController.createPost.bind(postController))

postsRoute.put('/:id',
    authenticationMiddleware,
    paramValidation,
    postBodyValidation,
    errorsFormatMiddleware,
    postController.updatePost.bind(postController))

postsRoute.post('/:id/comments',
    accessTokenMiddlewareProtected,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    postController.createCommentByPost.bind(postController))
postsRoute.get('/:id/comments',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    commentsQueryValidation,
    errorsFormatMiddleware,
    postController.getCommentsByPost.bind(postController))