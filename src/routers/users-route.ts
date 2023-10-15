import {Router} from "express";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {usersQueryValidation} from "../midlewares/query/users-query-validation";
import {paramValidation} from "../midlewares/param/param-validation";
import {container} from "../composition-root";
import {UserController} from "../controllers/user-controller";


export const usersRoute = Router({})

const userController = container.resolve(UserController)

usersRoute.get('/',
    authenticationMiddleware,
    usersQueryValidation,
    userController.getUsers.bind(userController))

usersRoute.post('/',
    authenticationMiddleware,
    usersRegistrationBodyValidation,
    errorsFormatMiddleware,
    userController.createUser.bind(userController))

usersRoute.delete('/:id',
    authenticationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    userController.deleteUser.bind(userController))
