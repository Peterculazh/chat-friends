import { IChannel } from "../Layout/ChatLayout";
import UserList from "./Users";



export default function Chat({ channel }: { channel: IChannel | undefined }) {
    console.log(channel);
    return (
        <>{
            channel ?
                <>
                    <UserList users={channel.users} />
                </>
                : "test"
        }
        </>
    )
}
