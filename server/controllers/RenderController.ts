import { before, GET, route } from "awilix-express";
import { Request, Response } from 'express';
import passport from "passport";
import ServerContext from "../ServerContext";



@route('')
export default class RenderController extends ServerContext {

    @GET()
    @route('/')
    async indexPage(_: Request, res: Response) {
        try {
            return res.print('/', {});
        } catch (error) {
            console.log('happent error', error);
            return res.print('/', { error });
        }
    }

    @GET()
    @route('/chat')
    @before([passport.authenticate('jwt')])
    async mainChatPage(_: Request, res: Response) {
        try {
            console.log('render');
            return res.print('/mainChat', {});
        } catch (error) {
            console.log('happen error', error);
            return res.print('/', { error });
        }
    }
}