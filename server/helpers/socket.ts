import ServerContext from "../ServerContext";
import { Server } from 'socket.io';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface IClient {
    id: number,
    name: string,
    socket: any,
    rooms: {
        [key: string]: IChannel
    }
}

interface IChannel {
    publicName: string,
    name: string,
    messages: IMessage[],
    id: string,
    clients: {
        [key: string]: IClient
    },
}

interface IMessage {
    message: string,
    author: string,
    createdAt: number,
}

interface IPublicClientData {
    name: string,
    id: number,
    isYou: boolean
}


export default class Socket extends ServerContext {
    public io!: Server;
    public clients!: { [key: string]: IClient };
    public channels!: Array<IChannel>;

    public createMessage = (name: string, message: string) => {
        return {
            name,
            message,
            time: new Date()
        };
    }

    public async init() {
        this.clients = {};
        this.channels = [];
        this.createChannel("main", "Main Room");
        const mainChannel = this.getChannelByName("main");
        if (mainChannel) {
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
                    .on('connection', async (socket) => {
                        const client = this.createClient(socket);
                        socket.id;
                        this.addClientToChannel("main", client, socket);

                        socket.emit("joinRoom", {
                            channelName: mainChannel.publicName,
                            channelId: mainChannel.id,
                            messages: mainChannel.messages,
                            users: this.getClientsDataInChannel(mainChannel, client),
                        });


                        socket.on("message", (data: { id: number, nickname: string, message: string }) => {
                            this.io.emit("message", this.createMessage(data.nickname, data.message));
                        });

                        socket.on("addFriend", async (data: { id: number }) => {
                            if (data.id && data.id !== socket.decodedToken.id) {
                                const result = await this.di.FriendService.sendRequestToFriend(data.id, socket.decodedToken.id);
                                if (result && result.length) {
                                    const [incomingRequests] = result;
                                    const sendFriendRequest = this.clients[incomingRequests.user.id];
                                    this.io.to(sendFriendRequest.socket.id).emit("friendInvite", incomingRequests.incomingRequests);
                                    // console.log("socket id",sendFriendRequest.socket.id);
                                    // console.log(outComingRequest);
                                }
                            }
                        });

                    });
            } catch (err) {
                console.log("Socket error - ", err);
            }
        } else {
            console.log("Trouble with creating main channel");
            // console.log("Trying to run sockets again", this.init());
        }

    }

    public getClientsDataInChannel(channel: IChannel, socketClient: IClient) {
        const clients: IPublicClientData[] = Object.values(channel.clients).map(client => {
            return {
                name: client.name,
                id: client.id,
                isYou: client.id === socketClient.id ? true : false, // TODO: Change name
            }
        });
        return clients;
    }

    public getChannelById(id: string) {
        return this.channels.find(channel => channel.id === id);
    }

    public getChannelByName(name: string) {
        return this.channels.find(channel => channel.name === name);
    }

    public addClientToChannel(name: string, client: IClient, socket: any) {
        const channel = this.getChannelByName(name);
        if (channel) {
            channel.clients[client.id] = client;
            socket.join(channel.name);
        }
    }

    public createChannel(name: string, publicName: string, id = uuidv4()) {
        this.channels.push({
            name,
            publicName,
            id,
            clients: {},
            messages: []
        });
    }

    public createClient(socket: any): IClient {
        const client = {
            id: socket.decodedToken.id,
            name: socket.decodedToken.name,
            socket: socket,
            rooms: {}
        };

        this.clients[client.id] = { ...client };

        return this.clients[client.id];
    }
}