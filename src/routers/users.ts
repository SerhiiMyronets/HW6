import {Response, Router} from "express";
import {RequestWithBody} from "./request-types";
import {UsersInputModel} from "../models/repository/users-models";
import {usersService} from "../domain/users-service";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {usersBodyValidation} from "../midlewares/body/users-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {usersQueryValidation} from "../midlewares/query/users-query-validation";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";


export const usersRoute = Router({})


usersRoute.get('/',
    authenticationMiddleware,
    usersQueryValidation,
    async (req: any, res: Response) => {
        const result = await usersQueryRepository.findUsersQuery(req.query)
        res.send(result)
    })
usersRoute.post('/',
    authenticationMiddleware,
    usersBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<UsersInputModel>, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    })