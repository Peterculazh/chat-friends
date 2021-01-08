
import ServerContext from "./ServerContext";
import { Request } from 'express';
import passport from "passport";

export default class Passport extends ServerContext {

    public jwtFromCookie(req: Request) {
        let token = null;
        if (req?.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    }

    public async init() {

        passport.serializeUser((user: any, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id: number, done) => {
            const user = await this.di.RepositoryService.UserRepository.findOne(id);
            done(null, user);
        });

        let JwtStrategy = require('passport-jwt').Strategy;
        let opts: any = {}
        opts.jwtFromRequest = this.jwtFromCookie;
        opts.secretOrKey = this.di.config.jwtSecret;
        passport.use(new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
            if (jwt_payload?.id) {
                const user = await this.di.RepositoryService.UserRepository.findOne(jwt_payload.id);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        }));
    }
}