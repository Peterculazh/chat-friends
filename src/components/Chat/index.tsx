import { IChannel } from "../Layout/ChatLayout";
import { Socket } from "socket.io-client";
import UserList from "./Users";



export default function Chat({ channel, socket }: { channel: IChannel | undefined, socket: Socket }) {
    console.log(channel);
    return (
        <>{
            channel ?
                <>
                    <UserList users={channel.users} socket={socket} />
                </>
                : "test"
        }
        </>
    )
}
