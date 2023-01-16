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
import Game from './Game/Game';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import GamePage from './GamePage';
import GameListPage from './GameListPage';
import Login from './Login';

function App() {
 
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    setToken(localStorage.getItem('userToken'));

    console.log(token)
  }, [])
  
  return (
    <div className="App">
      <div>Navbar</div>
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={token ? <GamePage/> : <Login/>}/>
        <Route path="/" element={token ?  <GameListPage /> : <Login />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
