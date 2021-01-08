import { useEffect, useState } from "react";
import { IMessage } from "../interfaces/message";
import Cookie from 'js-cookie';
import { io } from "socket.io-client";

export default function MainChat() {


    // const [messages, setMessage] = useState<IMessage[]>([]);
    // const [userMessage, setUserMessage] = useState("");
    // const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        // console.log(Cookie.get('jwt'))
        // if (username && username.length > 2 && username.length < 15) {{
        // io({
        //     extraHeaders: { Authorization: `Bearer ${Cookie.get('jwt')}}` }
        // });
        io({
            query: `jwt=${Cookie.get('jwt')}`
        });
        // }
    });

    const handleSubmitMessage = (e: any) => {
        // if (userMessage.length < 3) {
        //     return false;
        // }
        // if (socket) {
        //     socket.emit('user message', {
        //         name: "test",
        //         message: userMessage
        //     });
        //     setUserMessage("");
        // }
    }
    return (
        <>
            Welcome to main chat!
            <button onClick={handleSubmitMessage}>test</button>
        </>
    )
}
