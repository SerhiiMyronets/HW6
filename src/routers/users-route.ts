import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request-types";
import {findUserPaginateModel, UserInputModel} from "../models/repository/users-models";
import {usersService} from "../domain/users-service";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
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
    usersRegistrationBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response) => {
        const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
    })
usersRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const ifUserDeleted = await usersService.deleteUser(req.params.id)
        if (ifUserDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
