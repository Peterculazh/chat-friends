import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

enum Form{
    LOGIN = "login",
    REGISTER = "register"
}

export default function Login() {

    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [authForm, setAuthForm] = useState<any>(Form.LOGIN);
    const router = useRouter();

    const onSubmit = async (_: any) => {
        const result = await axios.post(`/user/${authForm}`, {
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
            <form>
                {authForm}
                <input type="text" name="nickname" value={nickName} onChange={e => setNickName(e.target.value)} />
                <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={onSubmit}>Submit</button>
            </form>
            <select name="form" onChange={(e) => setAuthForm(e.target.value)}>
                <option value={Form.LOGIN}>{Form.LOGIN}</option>
                <option value={Form.REGISTER}>{Form.REGISTER}</option>
            </select>
        </>
    )
}
