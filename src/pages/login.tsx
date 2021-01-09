import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {

    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const onSubmit = async (_: any) => {
        console.log(nickName, password);
        const result = await axios.post('/user/login', {
            nickname: nickName,
            password: password
        });

        if(result.data?.data?.success){
            router.push('/');
            console.log(result);
        }
    }

    return (
        <>
            Welcome
            {/* <form>
                registration
                <input type="text" name="nickname" value={nickName} onChange={e => setNickName(e.target.value)} />
                <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={onSubmit}>Submit</button>
            </form> */}

            <form>
                login
                <input type="text" name="nickname" value={nickName} onChange={e => setNickName(e.target.value)} />
                <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={onSubmit}>Submit</button>
            </form>
        </>
    )
}
