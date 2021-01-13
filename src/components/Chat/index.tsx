import { IChannel, IPublicClientData } from "../Layout/ChatLayout";
import { Socket } from "socket.io-client";
import UserList from "./Users";
import { FormEvent, useState } from "react";



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
        <>{
            channel ?
                <>
                    <UserList users={channel.users} socket={socket} />
                </>
                : "test"
        }
            {
                channel ?
                    <div>
                        {channel.messages.map((message, index) => <div key={index}>
                            <div>
                                {message.name}
                            </div>
                            {message.message}
                        </div>)}

                        <div>
                            <form onSubmit={handleSubmit}>
                                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                    :
                    "no channel"
            }
        </>
    )
}
