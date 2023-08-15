import {Request, Response, Router} from "express";
import {RequestWithBody} from "./request-types";
import {UsersInputModel} from "../models/repository/users-models";
import {usersService} from "../domain/users-service";


export const usersRoute = Router({})


usersRoute.get('/', async (req: Request, res: Response) => {


    res.send('tu hiu')
})
usersRoute.post('/', async (req: RequestWithBody<UsersInputModel>, res: Response) => {
    const newUser = await usersService.createUser({email: req.body.email, password: req.body.password, login: req.body.login})
    res.status(201).send(newUser)
})