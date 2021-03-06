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
    outcomingRequests: IFriendData[],
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
    name: string,
    createdAt: number,
}

interface IPublicClientData {
    name: string,
    id: number,
    isYou: boolean,
    friends?: IFriendData[],
    incomingRequests?: IFriendData[],
    outcomingRequests?: IFriendData[],
}


export default class Socket extends ServerContext {
    public io!: Server;
    public clients!: { [key: string]: IClient };
    public channels!: Array<IChannel>;

    public async init() {
        try {
            this.clients = {};
            this.channels = [];
            this.createChannel("main", "Main Room");
            const mainChannel = this.getChannelByName("main");
            if (mainChannel) {
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
                            outcomingRequests: client.outcomingRequests,
                        });

                        this.addClientToChannel("main", client, socket);

                        socket.emit("joinRoom", {
                            channelName: mainChannel.publicName,
                            channelId: mainChannel.id,
                            messages: mainChannel.messages,
                            users: this.getClientsDataInChannel(mainChannel, client),
                        });


                        socket.on("addFriend", async (data: { id: number }) => {
                            if (data.id && data.id !== socket.decodedToken.id) {
                                const result = await this.di.FriendService.sendRequestToFriend(data.id, socket.decodedToken.id);
                                if (result && result.length) {
                                    const [incomingRequests, outComingRequest] = result;
                                    const incomingUser = {
                                        id: incomingRequests.user.id,
                                        name: incomingRequests.user.name
                                    };
                                    const outcomingUser = {
                                        name: outComingRequest.user.name,
                                        id: outComingRequest.user.id,
                                    };
                                    const sendFriendRequest = this.clients[incomingRequests.user.id];

                                    this.io.to(sendFriendRequest.socket.id).emit("friendInvite", outcomingUser);
                                    this.io.to(socket.id).emit("friendRequest", incomingUser);

                                    this.clients[incomingRequests.user.id].incomingRequests.push(outcomingUser);
                                    this.clients[outComingRequest.user.id].outcomingRequests.push(incomingUser);

                                }
                            }
                        });

                        socket.on("acceptRequest", async (data: { sourceUser: { id: number }, targetUser: { id: number } }) => { // There targetUser is user from which have come socket event
                            await this.di.FriendService.acceptFriend(data.targetUser.id, data.sourceUser.id);

                            const [sourceUserData, targetUserData] = this.getPublicDataUsersByIds(data.sourceUser.id, data.targetUser.id);

                            this.io.to(socket.id).emit("addFriend", sourceUserData);
                            this.io.to(this.clients[data.targetUser.id].socket).emit("addFriend", targetUserData);
                        });

                        socket.on("declineRequest", async (data: { sourceUser: { id: number }, targetUser: { id: number } }) => { // There targetUser is user from which have come socket event
                            await this.di.FriendService.declineFriend(data.targetUser.id, data.sourceUser.id);

                            const [sourceUserData, targetUserData] = this.getPublicDataUsersByIds(data.sourceUser.id, data.targetUser.id);

                            this.io.to(socket.id).emit("declineRequest", sourceUserData);
                            this.io.to(this.clients[data.targetUser.id].socket).emit("declineRequest", targetUserData);
                        });

                        socket.on("message", async (data: { id: number, name: string, channelId: string, message: string }) => {
                            const channel = this.getChannelById(data.channelId);
                            if (channel) {
                                const message = this.addMessageToChannel(channel, data.name, data.message);
                                this.io.to(channel.name).emit("message", {
                                    message,
                                    channelId: channel.id
                                });
                            }
                        });

                    });
            } else {
                console.log("Trouble with creating main channel");
            }
        }
        catch (err) {
            console.log("Socket error - ", err);
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
                clientObject["outcomingRequests"] = socketClient.outcomingRequests;
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
        const client: IClient = {
            id: socket.decodedToken.id,
            name: socket.decodedToken.name,
            socket: socket,
            rooms: {},
            friends: this.getPublicDataUsersFromFriendList(result.friendList?.friends),
            incomingRequests: this.getPublicDataUsersFromFriendList(result.friendList?.incomingRequests),
            outcomingRequests: this.getPublicDataUsersFromFriendList(result.friendList?.outcomingRequests),
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

    public addMessageToChannel(channel: IChannel, name: string, message: string) {
        const newMessage: IMessage = this.createMessage(name, message);
        channel.messages.push(newMessage);
        return newMessage;
    }

    public createMessage(name: string, message: string): IMessage {
        return {
            name,
            message,
            createdAt: Date.now()
        }
    }

    public getPublicDataUsersByIds(...ids: number[]): IFriendData[] | [] {
        if (!ids || !ids.length) {
            return [];
        }
        return ids.map(id => {
            return {
                id: this.clients[id].id,
                name: this.clients[id].name,
            }
        });
    }
}