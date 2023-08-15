import {body} from "express-validator";

export const usersBodyValidation = [
    body('login').exists().isString().isLength({min: 3, max: 10}).withMessage('Login length should be from 3 to 10 symbols.'),
    body('login').matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login should contain only letters, numbers, \'_\' or \'-\''),
    body('password').exists().isString().isLength({min: 6, max: 20}).withMessage('Password length should be from 6 to 20 symbols.'),
    body('email').isString().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email should be in valid format'),
]