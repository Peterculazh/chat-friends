import { before, POST, route } from "awilix-express";
import { Request, Response } from 'express';
import passport from "passport";
import ServerContext from "../ServerContext";

@route('/chat')
export default class ChatController extends ServerContext {

    @POST()
    @route('')
    @before([passport.authenticate('jwt')])
    async registerUser(req: Request, res: Response) {
        try {
            console.log("message", req.body);
            return res.answer({ success: true }, "Success message", 201);
        } catch (error) {
            console.log('1,',error);
            return res.answer({ error }, "Happen error", 500);
        }
    }
}