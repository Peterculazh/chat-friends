import React from "react";
import ChatLayout from "src/components/Layout/ChatLayout";

function Chat() {
    return (
        <div>
            Welcome to chat page!
        </div>
    )
}

Chat.getLayout = (page: any) => <ChatLayout>
    {page}
</ChatLayout>;

export default Chat;
