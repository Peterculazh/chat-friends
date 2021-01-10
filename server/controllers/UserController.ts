import { POST, route } from "awilix-express";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ServerContext from "../ServerContext";

@route('/user')
export default class UserController extends ServerContext {

    @POST()
    @route('/register')
    async registerUser(req: Request, res: Response) {
        try {
            const user = await this.di.UserService.createUser(req.body);
            return res.answer({ success: true, name: user.name }, "Success register", 201);
        } catch (error) {
            console.log('/register error - ',error);
            return res.answer({ error }, "Happen error", 500);
        }
    }

    @POST()
    @route('/login')
    async loginUser(req: Request, res: Response) {
        try {
            const user = await this.di.UserService.getAuthenticatedUser(req.body);
            if (user && user.id && user.name) {
                const token = jwt.sign({ id: user.id, name: user.name }, this.di.config.jwtSecret);
                res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 * 24 });
                return res.answer({ success: true, name: user.name }, "Success login", 201);
            } else {
                return res.answer({ error: "no such user" }, "Happen error", 404);
            }
        } catch (error) {
            console.log('/login error - ',error);
            return res.answer({ error }, "Happen error", 500);
        }
    }
}