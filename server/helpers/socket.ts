
import ServerContext from "../ServerContext";
import { Server } from 'socket.io';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';

export default class Socket extends ServerContext {
    public io!: Server;

    public createMessage = (name: string, message: string) => {
        return {
            name,
            message,
            time: new Date()
        };
    }

    public async init() {
        try {
            this.io = new socketIO.Server(this.di.server.listener);
            this.io.use((socket: any, next) => {
                const query: any = socket.handshake.query;
                const result = jwt.verify(query.jwt, this.di.config.jwtSecret)
                if (result) {
                    socket.decodedToken = result;
                } else {
                    next(new Error("No way"));
                }
                next();
            });
            this.io
                .on('connection', socket => {
                    console.log("authenticated", socket.decodedToken);
                    socket.on("main-chat-user-message", (data: { id: number, nickname: string, message: string }) => {
                        this.io.emit("main-chat-message", this.createMessage(data.nickname, data.message));
                    });

                });
        } catch (err) {
            console.log("Socket error - ", err);
        }

    }
}