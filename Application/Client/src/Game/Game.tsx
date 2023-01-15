import React, { createContext, useCallback } from 'react';
import logo from './logo.svg';
import pic from './Res/grass.jpg';
import sword from './Res/sword.png';
import { useState, useEffect } from 'react';
import './Game.css';
import {GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { Figure} from './Figure.dto';
import { createFigure } from './FigureFactoryDto';
import FigureFactory from './FigureFactory';
import { OnClickStrategy } from './OnClickStrategy';
function test(i: string) {
  alert("haha: " + String(i));
}





interface AppContextInterface 
{
  onClickStrategy: any;
  setOnClickStrategy: any;
  currentFigure: any;
  setFigures: any;
}



export const AppContext = createContext<AppContextInterface | null>(null);

function Game() {
  
  class SelectStrategy extends OnClickStrategy //bolje da su static?
  {
    constructor()
    {
      super();
    }
    onClick(index: number, figures: Figure[]): void {
      setCurrentFigure(figures[index]);
      console.log("selectstrategy")
    }
    
  }

  const [figures, setFigures] = useState([] as Figure[]);
  const [onClickStrategy, setOnClickStrategy] = useState<OnClickStrategy>(new SelectStrategy());
  const [currentFigure, setCurrentFigure] = useState<Figure>();
  const hexagonSize = { x: 10, y: 10 };
  const moreHexas = GridGenerator.orientedRectangle(5, 5);
  

  useEffect(() => {

    let figures: Figure[] = [];
    console.log("useeffect")
    for(let i = 0; i < 25; i++)
    {
      if(i == 10)
        figures.push(createFigure("army", {"id":i, "name": "testARMY", "img": "pat-2","type": "army", "size": 100}));
      else
        figures.push(createFigure("grass", {"id":i,"name": "grass" + i,"img": "pat-1", "type": "grass"}));
    } 

    setFigures(figures);

  }, [])



  const AppContextValue: AppContextInterface = { onClickStrategy:onClickStrategy, setOnClickStrategy : setOnClickStrategy, setFigures: setFigures, currentFigure: currentFigure}
  return (
    <div className="Game">
      <AppContext.Provider value={AppContextValue}>
        <HexGrid width={1200} height={800} viewBox="-10 -10 100 100">
          {/* Main grid with bit hexagons, all manual */}

          {/* Additional small grid, hexagons generated with generator */}
          <Layout size={hexagonSize} origin={{ x: 0, y: 0 }}>
            { moreHexas.map((hex, i) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} fill={figures[i]?.img} onClick={() => onClickStrategy?.onClick(i, figures)} />) }
          </Layout>

          {/* You can define multiple patterns and switch between them with "fill" prop on Hexagon // insert images here*/}
          <Pattern id="pat-1" link={pic} size={hexagonSize} />
          <Pattern id="pat-2" link={sword} size={hexagonSize} />
          {/* insert functions here */}

        </HexGrid>
        <p>Currently selected tile: {currentFigure?.name} </p>
        
        <FigureFactory figure={currentFigure} />
        <img src={pic} alt="" height={100} width={100} onClick={() => console.log(onClickStrategy)}/>
      </AppContext.Provider>
    </div>
  );
}

export default Game;
