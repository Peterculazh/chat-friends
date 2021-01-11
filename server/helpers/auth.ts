import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const isAuthUser = (_req: Request, res: Response, next: NextFunction, redirectRoute: string) =>
    passport.authenticate('jwt', (err, user, _info) => {
        // if (err) {
        //     // return res.print('/', { redirect: '/login' });
        // }
        if (!user) {
            console.log('/')
            return res.redirect(redirectRoute);
        }
        console.log('route "/" jwt auth -', err, user);
        next()
    })(_req, res, next);
