import {Router} from "express";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {authBodyValidation} from "../midlewares/body/auth-body-validation";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {usersRegistrationBodyValidation} from "../midlewares/body/users-registration-body-validation";
import {refreshTokenMiddleware} from "../midlewares/refresh-token-middleware";
import {apiRequestMiddleware} from "../midlewares/apiRequestMiddleware";
import {authPasswordRecoveryValidation} from "../midlewares/body/auth-password-recovery-validation";
import {authNewPasswordValidation} from "../midlewares/body/auth-new-password-validation";
import {authController} from "../composition-root";


export const authRoute = Router({})



authRoute.post('/login',
    authBodyValidation,
    apiRequestMiddleware,
    errorsFormatMiddleware,
    authController.login.bind(authController))

authRoute.get('/me',
    accessTokenMiddlewareProtected,
    authController.aboutMe.bind(authController))

authRoute.post('/registration',
    apiRequestMiddleware,
    usersRegistrationBodyValidation,
    errorsFormatMiddleware,
    authController.registerNewUser.bind(authController))

authRoute.post('/registration-confirmation',
    apiRequestMiddleware,
    authController.confirmRegistration.bind(authController))

authRoute.post('/registration-email-resending',
    apiRequestMiddleware,
    authController.resendConfirmationEmail.bind(authController))

authRoute.post('/password-recovery',
    apiRequestMiddleware,
    authPasswordRecoveryValidation,
    errorsFormatMiddleware,
    authController.sendPasswordRecoveryEmail.bind(authController))

authRoute.post('/new-password',
    apiRequestMiddleware,
    authNewPasswordValidation,
    errorsFormatMiddleware,
    authController.createNewPassword.bind(authController))

authRoute.post('/refresh-token',
    refreshTokenMiddleware,
    authController.getNewRefreshToken.bind(authController))

authRoute.post('/logout',
    refreshTokenMiddleware,
    authController.logout.bind(authController))