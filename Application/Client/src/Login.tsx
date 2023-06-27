import React, {useState, useEffect} from 'react'
import { login } from './services/user.service';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
interface Props{
    setToken:any;
}
function Login(props: Props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        //Prevent page reload
        event.preventDefault();

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

        localStorage.setItem("userToken", result.data._id);
        localStorage.setItem("username", result.data.username);
        
        props.setToken(result.data._id)
    };
    
    return (
//     <div>   
//         <div className="form" onSubmit={handleSubmit}>
//             <form>
//             <div className="input-container">
//                 <label>Username </label>
//                 <input type="text" name="uname" onChange={e => setUsername(e.target.value)} required />
//             </div>
//             <div className="input-container">
//                 <label>Password </label>
//                 <input type="password" name="pass" onChange={e => setPassword(e.target.value)}required />
//             </div>
//             <div className="button-container">
//                 <input type="submit" />
//             </div>
//             </form>
//         </div>
//   </div>
    <Form className="mx-auto" style={{"width": "200px"}} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="uname" placeholder="Username"  onChange={e => setUsername(e.target.value)} required/>

        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        </Form.Group>

        <Button variant="primary" type="submit">Login</Button>

        <Button variant='secondary' onClick={() => {navigate("/register")}}>Register</Button>
    </Form>

  )
}

export default Login