import {body} from "express-validator";
import {usersDbRepository} from "../../repositories/db-repositories/users-db-repository";

export const usersRegistrationBodyValidation = [
    body('login').exists().isString().isLength({
        min: 3,
        max: 10
    }).withMessage('Login length should be from 3 to 10 symbols.'),
    body('login').matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login should contain only letters, numbers, \'_\' or \'-\''),
    body("login").custom(async login => {
        const isLoginExist = await usersDbRepository.findUserByLoginOrEmail(login);
        if (isLoginExist) throw new Error("Your login is already used")
    }),
    body('password').exists().isString().isLength({
        min: 6,
        max: 20
    }).withMessage('Password length should be from 6 to 20 symbols.'),
    body('email').isString().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email should be in valid format'),
    body("email").custom(async email => {
        const isEmailExist = await usersDbRepository.findUserByLoginOrEmail(email);
        if (isEmailExist) throw new Error("Your email is already used")
    }),
]