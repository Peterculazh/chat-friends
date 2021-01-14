import { IChannel, IPublicClientData } from "../../pages/index";
import { Socket } from "socket.io-client";
import UserList from "./Users";
import { FormEvent, useState } from "react";
import '../../styles/components/chat.sass';



export default function Chat({ channel, socket, userData }: { channel: IChannel | undefined, socket: Socket, userData: IPublicClientData }) {
    const [text, setText] = useState("");


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("message", {
            id: userData.id,
            channelId: channel?.channelId,
            message: text,
            name: userData.name,
        });
    }

    return (
        <div className="chat-wrapper">{
            channel ?
                <>
                    <UserList users={channel.users} socket={socket} />
                </>
                : <div>
                    No connection with channel
                </div>
        }
            {
                channel ?
                    <div className="chat">
                        <div className="chat-message-list">
                            {channel.messages.map((message, index) => <div key={index} className="item">
                                <div className="item-info">
                                    <div className="item-author">
                                        {message.name}
                                    </div>
                                    <div className="item-time">
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="item-message">
                                    {message.message}
                                </div>
                            </div>)}

                        </div>
                        <form onSubmit={handleSubmit} className="chat-form">
                            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    : <div>
                        No connection with channel
                </div>
            }
        </div>
    )
}
