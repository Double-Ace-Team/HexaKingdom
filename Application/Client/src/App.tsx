import React, { createContext, useCallback } from 'react';
import logo from './logo.svg';
import pic from './grass.jpg';
import sword from './sword.png';
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
function test(i: string) {
  alert("haha: " + String(i));
}



function App() {
 

  return (
    <div className="App">
      <div>Navbar</div>
    <BrowserRouter>
      <Routes>
        <Route path="/game/:id" element={<GamePage/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
