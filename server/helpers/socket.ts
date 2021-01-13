import ServerContext from "../ServerContext";
import { Server } from 'socket.io';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from "../entity/User";

interface IFriendData {
    id: number,
    name: string,
}

interface IClient {
    id: number,
    name: string,
    socket: any,
    rooms: {
        [key: string]: IChannel
    },
    friends: IFriendData[],
    incomingRequests: IFriendData[],
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
    isYou: boolean,
    friends?: IFriendData[],
    incomingRequests?: IFriendData[],
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
                        const client = await this.createClient(socket);
                        if (!client) {
                            console.log("Failed to create connection because user don't exists");
                            return false;
                        }
                        this.io.to(socket.id).emit("userData", {
                            id: client.id,
                            name: client.name,
                            friends: client.friends,
                            incomingRequests: client.incomingRequests,
                        });
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
                                    const [incomingRequests, outComingRequest] = result;
                                    const sendFriendRequest = this.clients[incomingRequests.user.id];
                                    this.io.to(sendFriendRequest.socket.id).emit("friendInvite", incomingRequests.incomingRequests);
                                    this.io.to(socket.id).emit("friendRequest", outComingRequest.outcomingRequests);
                                }
                            }
                        });

                        socket.on("acceptRequest", async (data: { sourceUser: { id: number }, targetUser: { id: number } }) => {
                            await this.di.FriendService.acceptFriend(data.targetUser.id, data.sourceUser.id);
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
            const clientObject: IPublicClientData = {
                name: client.name,
                id: client.id,
                isYou: false
            };
            if (client.id === socketClient.id) {
                clientObject["isYou"] = true;
                clientObject["friends"] = socketClient.friends;
                clientObject["incomingRequests"] = socketClient.incomingRequests;
            }
            return clientObject;
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

    public async createClient(socket: any): Promise<IClient | false> {
        const result = await this.di.RepositoryService.UserRepository.findOne({ id: socket.decodedToken.id }, { relations: ["friendList"] });
        if (!result) {
            return false;
        }
        console.log("result", result);
        const client: IClient = {
            id: socket.decodedToken.id,
            name: socket.decodedToken.name,
            socket: socket,
            rooms: {},
            friends: this.getPublicDataUsersFromFriendList(result.friendList?.friends),
            incomingRequests: this.getPublicDataUsersFromFriendList(result.friendList?.incomingRequests),
        };

        this.clients[client.id] = { ...client };

        return this.clients[client.id];
    }

    public getPublicDataUsersFromFriendList(users: User[]): IFriendData[] | [] {
        if (!users || !users.length) {
            return [];
        }
        return users.map(user => {
            return {
                id: user.id,
                name: user.name
            }
        });
    }
}