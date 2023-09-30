import {body} from "express-validator";
import {LikeStatusType} from "../../models/repository/comments-models";

export const likeInputValidation = [
    body('likeStatus').isIn(Object.values(LikeStatusType)).withMessage('Like status incorrect')
]