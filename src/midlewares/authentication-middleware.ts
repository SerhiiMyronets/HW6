import {NextFunction, Request, Response} from "express";
import {auth} from "../setting";

export const authenticationMiddleware = (req: Request<any,any,any,any>, res: Response, next: NextFunction) => {

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    try {
        const [login, password] = atob(b64auth).split(':')
        if (
            login !== auth.login ||
            password !== auth.password ||
            (req.headers.authorization || '').split(' ')[0] !== 'Basic'
        ) {
            return res.status(401).send('Authentication required.')
        }
        return next()
    } catch (e) {
        return res.status(401).send('Authentication required.')
    }
}