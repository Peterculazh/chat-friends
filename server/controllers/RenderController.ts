import { before, GET, route } from "awilix-express";
import { NextFunction, Request, Response } from 'express';
import { isAuthUser } from "../helpers/auth";
import ServerContext from "../ServerContext";

@route('')
export default class RenderController extends ServerContext {


    @GET()
    @route('/')
    @before([(req: Request, res: Response, next: NextFunction) => isAuthUser(req, res, next, "/auth")])
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
    @before([(req: Request, res: Response, next: NextFunction) => isAuthUser(req, res, next, "/auth")])
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
    @route('/auth')
    async authPage(_: Request, res: Response) {
        try {
            console.log("render /auth")
            return res.print('/auth', {});
        } catch (error) {
            console.log('error on render route - /auth', error);
            return res.print('/', { error });
        }
    }
}