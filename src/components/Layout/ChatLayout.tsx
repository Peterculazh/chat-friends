import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Chat from "../Chat";


export interface IMessage {
    message: string,
    author: string,
    createdAt: number,
}
export interface IChannel {
    channelName: string,
    channelId: string,
    messages: IMessage[],
    users: [{
        name: string,
        id: number
    }],
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [chats, setChats] = useState<Array<IChannel>>([]);
    const [currentChat, setCurrentChat] = useState<null | string>(null);

    useEffect(() => {
        setSocket(io({
            query: `jwt=${Cookies.get('jwt')}`
        }));
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
        }
    }, [socket]);

    return (
        <>
            {connected ?
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
                        {currentChat ?
                            <div>
                                <Chat channel={chats.find(chat => chat.channelId === currentChat)} />
                            </div> :
                            <div>
                                Empty
                        </div>
                        }
                    </div>
                </div>
                : <div>
                    No connection
                </div>
            }
        </>
    )
}
