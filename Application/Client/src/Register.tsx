import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { register } from './services/user.service';
function Register() {
  
    const [username, setUsername] = useState("twe");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        //Prevent page reload
        event.preventDefault();

        if(!username)
            return;
        if(!password)
            return;

        const result = await register({username, password});

        if(!result.success)
        {
            alert('greska')
            return;
        }

        navigate("/");
        
    };
  return (
    <Form className="mx-auto" style={{"width": "200px"}} onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" name="uname" placeholder="Username"  onChange={e => setUsername(e.target.value)} required/>

    </Form.Group>

    <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
    </Form.Group>

    <Button onClick={() => console.log(username)} variant="primary" type="submit">Register</Button>
</Form>
  )
}

export default Register