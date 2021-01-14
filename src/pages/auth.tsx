import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../styles/pages/auth.sass';

enum Form {
    LOGIN = "Login",
    REGISTER = "Register"
}

export default function Login() {

    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [authForm, setAuthForm] = useState(Form.LOGIN);
    const router = useRouter();

    const onSubmit = async (_: any) => {
        const result = await axios.post(`/user/${authForm}`, {
            nickname: nickName,
            password: password
        });

        if (authForm === Form.LOGIN && result.data?.data?.success) {
            router.push('/');
            console.log(result);
        } else if (authForm === Form.REGISTER && result.data?.data?.success) {
            setAuthForm(Form.LOGIN);
        }
    }

    return (
        <div className="auth">
            <div className="auth-title">
                Welcome
            <select name="form" onChange={(e) => setAuthForm(e.target.value as Form)}>
                    <option value={Form.LOGIN}>{Form.LOGIN}</option>
                    <option value={Form.REGISTER}>{Form.REGISTER}</option>
                </select>
            </div>
            <form className="form">
                <div className="form-type">
                    {authForm}
                </div>
                <label>
                    <input type="text" name="nickname" value={nickName} placeholder="nickname" onChange={e => setNickName(e.target.value)} />
                </label>
                <label>
                    <input type="password" name="password" value={password} placeholder="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="button" onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}
