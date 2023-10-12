import {Router} from "express";
import {paramValidation} from "../midlewares/param/param-validation";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {accessTokenNonProtectedMiddleware} from "../midlewares/access-token-non-protected-middleware";
import {likeInputValidation} from "../midlewares/body/like-input-validation";
import {commentsController} from "../composition-root";


export const commentsRouter = Router({})


commentsRouter.get('/:id',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    commentsController.getComment.bind(commentsController))

commentsRouter.put('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:id/like-status',
    accessTokenMiddlewareProtected,
    // paramValidation,
    likeInputValidation,
    errorsFormatMiddleware,
    commentsController.commentLikeStatusUpdate.bind(commentsController))

commentsRouter.delete('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    errorsFormatMiddleware,
    commentsController.deleteComment.bind(commentsController))
