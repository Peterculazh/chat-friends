import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chat from "../components/Chat";
import "../styles/pages/index.sass";


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
    outcomingRequests: IFriendData[],
}

export default function ChatLayout() {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [chats, setChats] = useState<Array<IChannel>>([]);
    const [currentChat, setCurrentChat] = useState<null | string>(null); // String there are represents the IChannel.channelId
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
                setUserData(state => {
                    if (!state) {
                        return state;
                    }
                    const newState = { ...state };
                    newState.incomingRequests.push(data);
                    return newState;
                })
            });
            socket.on("friendRequest", (data: any) => {
                setUserData(state => {
                    if (!state) {
                        return state;
                    }
                    const newState = { ...state };
                    newState.outcomingRequests.push(data);
                    return newState;
                })
            });
            socket.on("addFriend", (data: any) => {
                console.log('addFriend', data);
            });
            socket.on("declineRequest", (data: any) => {
                console.log('declineRequest', data);
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
                <div className="chat-page-wrapper">
                    <div className="chat-page-sidebar">
                        <div className="chat-page-sidebar-item chat-page-chats-list">
                            <span>Chats</span>
                            {chats.map(chat =>
                                <div key={chat.channelId} className={`item ${chat.channelId === currentChat ? "selected" : ""}`}
                                    onClick={() => setCurrentChat(chat.channelId)}
                                >
                                    {chat.channelName}
                                </div>
                            )}
                        </div>
                        <div className="chat-page-sidebar-item">
                            <span>Friends</span>
                            {userData?.friends.map(friend =>
                                <div key={friend.id} className="item">
                                    {friend.name}
                                </div>
                            )}
                        </div>
                        <div className="chat-page-sidebar-item chat-page-incoming-requests">
                            <span>Incoming requests</span>
                            {userData?.incomingRequests.map(request =>
                                <div key={request.id} className="item">
                                    <div onClick={() => handleFriendAccept(request)}>
                                        {request.name} ---
                                </div>
                                    <div onClick={() => handleFriendDecline(request)}>
                                        decline
                            </div>
                                </div>
                            )}
                        </div>
                        <div className="chat-page-sidebar-item">
                            <span>Outcoming requests (waiting for response)</span>
                            {userData?.outcomingRequests.map(request =>
                                <div className="item" key={request.id}>
                                    {request.name}
                                </div>
                            )}
                        </div>
                    </div>
                    {currentChat && userData ?
                        <Chat userData={userData} channel={chats.find(chat => chat.channelId === currentChat)} socket={socket} />
                        :
                        <div className="chat-not-selected">
                            No selected chat
                            </div>
                    }
                </div>
                : <div>
                    No connection
                </div>
            }
        </>
    )
}
