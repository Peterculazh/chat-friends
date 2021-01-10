import { before, GET, route } from "awilix-express";
import { NextFunction, Request, Response } from 'express';
import passport from "passport";
import ServerContext from "../ServerContext";



@route('')
export default class RenderController extends ServerContext {


    @GET()
    @route('/')
    @before([
        (_req: Request, res: Response, next: NextFunction) => passport.authenticate('jwt', (err, user, _info) => {
            // if (err) {
            //     // return res.print('/', { redirect: '/login' });
            // }
            if (!user) {
                return res.redirect('/login');
            }
            console.log('route "/" jwt auth -', err, user);
            next()
        })(_req, res, next)
    ])
    async indexPage(_: Request, res: Response) {
        try {
            console.log('render / ');
            return res.print('/', {});
        } catch (error) {
            console.log('error on render route - / ', error);
            return res.print('/', { error });
        }
    }

    @GET()
    @route('/chat/:chatId')
    @before([
        (_req: Request, res: Response, next: NextFunction) => passport.authenticate('jwt', (err, user, _info) => {
            // if (err) {
            //     // return res.print('/', { redirect: '/login' });
            // }
            if (!user) {
                return res.redirect('/login');
            }
            console.log('route "/" jwt auth -', err, user);
            next()
        })(_req, res, next)
    ])
    async chats(_: Request, res: Response) {
        try {
            console.log('render /chat/:chatId');
            return res.print('/chat/[id]', {});
        } catch (error) {
            console.log('error on render route - /chat/:chatId', error);
            return res.print('/', { error });
        }
    }

    @GET()
    @route('/login')
    async loginPage(_: Request, res: Response) {
        try {
            return res.print('/login', {});
        } catch (error) {
            console.log('error on render route - /chat/:chatId', error);
            return res.print('/', { error });
        }
    }
}