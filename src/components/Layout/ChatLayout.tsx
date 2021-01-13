import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chat from "../Chat";


export interface IMessage {
    message: string,
    name: string,
    createdAt: number,
}
export interface IChannel {
    channelName: string,
    channelId: string,
    messages: IMessage[],
    users: IPublicClientData[],
}

export interface IFriendData {
    id: number,
    name: string,
}

export interface IPublicClientData {
    name: string,
    id: number,
    isYou: boolean,
    friends: IFriendData[],
    incomingRequests: IFriendData[],
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [chats, setChats] = useState<Array<IChannel>>([]);
    const [currentChat, setCurrentChat] = useState<null | string>(null);
    const [userData, setUserData] = useState<IPublicClientData>();

    useEffect(() => {
        if (!socket && !connected) {
            setSocket(io({
                query: `jwt=${Cookies.get('jwt')}`
            }));
        }
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', (_: any) => {
                console.log("connected");
                setConnected(true);
            });
            socket.on("joinRoom", (data: IChannel) => {
                setChats(currentChats => [...currentChats, data]);
            });
            socket.on("friendInvite", (data: any) => {
                console.log("friend invite", data);
            });
            socket.on("userData", (data: any) => {
                setUserData(data);
                console.log(data);
            });
            socket.on("message", ({ message, channelId }: {
                message: IMessage,
                channelId: string,
            }) => {
                if (message && channelId) {
                    console.log("message");
                    setChats(chats => {
                        const newChats = [...chats];
                        const chat = newChats.find(chat => chat.channelId === channelId);
                        if (chat) {
                            chat.messages.push(message);
                        }
                        return newChats;
                    });
                }
            });
        }
    }, [socket]);

    const handleFriendAccept = (user: IFriendData) => {
        socket?.emit("acceptRequest", {
            sourceUser: user,
            targetUser: {
                id: userData?.id,
            }
        });
    }

    const handleFriendDecline = (user: IFriendData) => {
        socket?.emit("declineRequest", {
            sourceUser: user,
            targetUser: {
                id: userData?.id,
            }
        });
    }

    return (
        <>
            {socket && connected ?
                <div>
                    <div className="chats">
                        {chats.map(chat =>
                            <div key={chat.channelId} className="item"
                                onClick={() => setCurrentChat(chat.channelId)}
                            >
                                {chat.channelName}
                            </div>
                        )}
                    </div>
                    <div>
                        {currentChat && userData ?
                            <div>
                                <Chat userData={userData} channel={chats.find(chat => chat.channelId === currentChat)} socket={socket} />
                            </div> :
                            <div>
                                No selected chat
                            </div>
                        }
                    </div>
                    <div>
                        Incoming requests
                        {userData?.incomingRequests.map(request =>
                        <div key={request.id} onClick={() => handleFriendAccept(request)}>
                            {request.name} ---
                            <div onClick={() => handleFriendDecline(request)}>
                                decline
                            </div>
                        </div>
                    )}
                    </div>
                    <div>
                        Outcoming requests (waiting for response)
                        {userData?.incomingRequests.map(request =>
                        <div key={request.id}>
                            {request.name}
                        </div>
                    )}
                    </div>
                    <div>
                        Friends
                        {userData?.friends.map(friend =>
                        <div key={friend.id}>
                            {friend.name}
                        </div>
                    )}
                    </div>
                </div>
                : <div>
                    No connection
                </div>
            }
        </>
    )
}
