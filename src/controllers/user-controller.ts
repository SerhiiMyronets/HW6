import {UsersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {UsersService} from "../domain/users-service";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request-types";
import {FindUserPaginateModel, UserInputModel} from "../models/repository/users-models";
import {Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class UserController {
    constructor(@inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersService) protected usersService: UsersService) {
    }

    async getUsers(req: RequestWithQuery<FindUserPaginateModel>, res: Response) {
        const result = await this.usersQueryRepository.findUsersQuery(req.query)
        res.send(result)
    }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response) {
        const newUserId = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        const newUser = await this.usersQueryRepository.findUser(newUserId)
        res.status(201).send(newUser)
    }

    async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
        const ifUserDeleted = await this.usersService.deleteUser(req.params.id)
        if (ifUserDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}