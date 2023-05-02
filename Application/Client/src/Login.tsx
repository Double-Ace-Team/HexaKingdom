import React, {useState, useEffect} from 'react'
import { login } from './services/user.service';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
function Login() {
    const [username, setUsername] = useState("twe");
    const [password, setPassword] = useState("");
  
    const handleSubmit = async (event: React.FormEvent) => {
        console.log("haha")
        //Prevent page reload
        event.preventDefault();
        console.log(username)
        if(!username)
            return;
        if(!password)
            return;
        console.log({password, username})
        const result = await login({username, password});
        console.log(result)
        if(!result.success)
        {
            alert('greska')
            return;
        }
        console.log(result.data);
        localStorage.setItem("userToken", result.data._id);
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

        <Button onClick={() => console.log(username)} variant="primary" type="submit">
        Submit
        </Button>
    </Form>

  )
}

export default Login