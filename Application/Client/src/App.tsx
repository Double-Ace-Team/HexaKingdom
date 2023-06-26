import React, { createContext, useCallback } from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import GamePage from './GamePage';
import GameListPage from './GameListPage';
import Login from './Login';
import { API_URL } from './config';
import { io, Socket } from 'socket.io-client';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import Register from './Register';

export const SocketContext  = createContext<Socket | undefined>(undefined);

function App() {
 
  const [token, setToken] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {

    setToken(localStorage.getItem('userToken'));



  }, [])

  useEffect(() => {
    if(!socket?.active)
    {
      const newSocket = io(API_URL+"/main");
      newSocket.on('connect', () => {
        console.log("conencted")
      });

      setSocket(newSocket)
    }
  }, [token])

  const logout = () => {

    localStorage.setItem("userToken", "");
    
    localStorage.setItem("username", "");

    socket?.disconnect();

    setToken(null);
  }

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>

        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">Hexa Kingdom</Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            {
            token ? 
            <Navbar.Collapse id="basic-navbar-nav"  className="justify-content-end">
              <NavDropdown title={localStorage.getItem("username")} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => {logout()}}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
            : null
            }
          </Container>
        </Navbar>

        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/game/:id" element={token ? <GamePage/> : <Login setToken={setToken}/>}/>
            <Route path="/" element={token ?  <GameListPage /> : <Login setToken={setToken}/>} />
          </Routes>
        </BrowserRouter>
            
      </SocketContext.Provider>
    </div>
  );
}

export default App;
