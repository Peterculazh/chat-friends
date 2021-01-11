


export default function ChatUserList(
    { users }: {
        users: [{
            name: string,
            id: number
        }]
    }) {
    return <div className="chat-user-list">
        {users.map(user => <div key={user.id}
            className="item">
            {user.name}
        </div>)}
    </div>
}
