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

export const SocketContext  = createContext<Socket | undefined>(undefined);

function App() {
 
  const [token, setToken] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    setToken(localStorage.getItem('userToken'));

    const newSocket = io(API_URL+"/main");
    newSocket.on('connect', () => {
      console.log("conencted")
    });

    setSocket(newSocket)

    return () => {socket?.disconnect();}

  }, [])

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>

    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#link">Username</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={token ? <GamePage/> : <Login/>}/>
        <Route path="/" element={token ?  <GameListPage /> : <Login />} />
      </Routes>
    </BrowserRouter>
          
    </SocketContext.Provider>
    </div>
  );
}

export default App;
