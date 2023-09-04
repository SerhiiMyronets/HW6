import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request-types";
import {findUserPaginateModel, UsersInputModel} from "../models/repository/users-models";
import {usersAuthService} from "../domain/users-auth-service";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {usersBodyValidation} from "../midlewares/body/users-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {usersQueryValidation} from "../midlewares/query/users-query-validation";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {paramValidation} from "../midlewares/param/param-validation";


export const usersRoute = Router({})

usersRoute.get('/',
    authenticationMiddleware,
    usersQueryValidation,
    async (req: RequestWithQuery<findUserPaginateModel>, res: Response) => {
        const result = await usersQueryRepository.findUsersQuery(req.query)
        res.send(result)
    })

usersRoute.post('/',
    authenticationMiddleware,
    usersBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<UsersInputModel>, res: Response) => {
        const newUser = await usersAuthService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    })
usersRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const ifUserDeleted = await usersAuthService.deleteUser(req.params.id)
        if (ifUserDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
