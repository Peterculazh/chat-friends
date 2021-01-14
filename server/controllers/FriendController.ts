import { before, POST, route } from "awilix-express";
import { Request, Response } from 'express';
import passport from "passport";
import ServerContext from "../ServerContext";

@route('/friend')
export default class FriendController extends ServerContext {

    @POST()
    @route('/request')
    @before([passport.authenticate('jwt')])
    async addRequest(req: Request, res: Response) {
        try {
            console.log("message", req.body);
            return res.answer({ success: true }, "Success message", 201);
        } catch (error) {
            console.log('1,',error);
            return res.answer({ error }, "Happen error", 500);
        }
    }
}