import React, {useState, useEffect} from 'react'
import { login } from './services/user.service';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSubmit = async (event: React.FormEvent) => {
        //Prevent page reload
        event.preventDefault();
        console.log({username, password})
        if(!username)
            return;
        if(!password)
            return;

        const result = await login({username, password});
        if(!result.success)
        {
            alert('greska')
            return;
        }
        console.log(result.data);
        localStorage.setItem("userToken", result.data._id);
    };
 
    return (
    <div>   
        <div className="form" onSubmit={handleSubmit}>
            <form>
            <div className="input-container">
                <label>Username </label>
                <input type="text" name="uname" onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="input-container">
                <label>Password </label>
                <input type="password" name="pass" onChange={e => setPassword(e.target.value)}required />
            </div>
            <div className="button-container">
                <input type="submit" />
            </div>
            </form>
        </div>
  </div>
  )
}

export default Login