import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const isAuthUser = (_req: Request, res: Response, next: NextFunction, redirectRoute: string) =>
    passport.authenticate('jwt', (_, user, _info) => {
        if (!user) {
            return res.redirect(redirectRoute);
        }
        next()
    })(_req, res, next);
