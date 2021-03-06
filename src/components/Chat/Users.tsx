import { Socket } from "socket.io-client";
import { IPublicClientData } from "src/interfaces/socket";
import '../../styles/components/chat-user-list.sass';



export default function ChatUserList({ users, socket }: {
    users: IPublicClientData[],
    socket: Socket
}) {

    const addFriend = (user: { name: string, id: number, isYou: boolean }) => {
        if (!user.isYou) {
            socket.emit("addFriend", { id: user.id });
        }
    }

    return users.length ? <div className="chat-user-list">
        {users.map(user => <div key={user.id}
            onClick={() => addFriend(user)}
            className="item">
            {user.name}
        </div>)}
    </div> :
        <div>
            No users
    </div>
}
