import React, { createContext, useCallback } from 'react';

import { useState, useEffect } from 'react';
import './App.css';
import {GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { Figure, FigureDto } from './Game/Figure.dto';
import { ArmyDto } from './Game/Army/Army.dto';
import { create } from 'domain';
import { createFigure } from './Game/FigureFactoryDto';
import FigureFactory from './Game/FigureFactory';
import { OnClickStrategy } from './Game/OnClickStrategy';
import Game, { AppContext } from './Game/Game';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import GamePage from './GamePage';
import GameListPage from './GameListPage';
import Login from './Login';
import { API_URL } from './config';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export const SocketContext  = createContext<Socket | undefined>(undefined);

function App() {
 
  const [token, setToken] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    setToken(localStorage.getItem('userToken'));

    const newSocket = io(API_URL);
    setSocket(newSocket)

    return () => {socket?.disconnect();}

  }, [])

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>

        <div>Navbar</div>

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
