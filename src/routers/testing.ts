import {Request, Response, Router} from "express";
import {
    ApiRequestDatabaseModel,
    BlogModel,
    CommentModel,
    DeviceAuthSessionsModel,
    LikeInfoModel,
    PasswordRecoveryModel,
    PostModel,
    UserModel
} from "../db/db";

export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    await BlogModel.deleteMany()
    await PostModel.deleteMany()
    await UserModel.deleteMany()
    await CommentModel.deleteMany()
    await LikeInfoModel.deleteMany()
    await DeviceAuthSessionsModel.deleteMany()
    await ApiRequestDatabaseModel.deleteMany()
    await PasswordRecoveryModel.deleteMany()
    res.sendStatus(204)
})