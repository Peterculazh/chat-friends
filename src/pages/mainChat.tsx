import axios from "axios"

export default function MainChat() {

    const onClick = (e: any)=>{
        axios.post('/chat/message', {
            message: "test"
        });
    }
    return (
        <>
            Welcome to main chat!
            <button onClick={onClick}>test</button>
        </>
    )
}
