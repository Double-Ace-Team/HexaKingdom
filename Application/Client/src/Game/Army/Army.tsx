import React, { useState, useEffect } from 'react'
import { Figure } from '../Figure.dto';
import { OnClickStrategy } from '../OnClickStrategy';
import { ArmyDto } from './Army.dto'
import { useContext } from 'react';
import { AppContext } from '../Game';
function Army() {
  
  const appContext = useContext(AppContext);
  const [prevClickStrategy, setPrevClickStrategy] = useState();

  useEffect(() => {
    setPrevClickStrategy(appContext?.onClickStrategy);
    console.log(appContext?.onClickStrategy)
  }, [appContext?.onClickStrategy])

  class SwapStrategy extends OnClickStrategy
  {
    constructor()
    {
      super();
    }
    onClick(index: number, figures: Figure[]): void {
      const figure = figures[index];

      if(appContext?.currentFigure == undefined)
      {
        alert("error swap tile");//throw new Error('Method not implemented.');
        return;
      }
      const selectedFigure: Figure = appContext?.currentFigure!;

      appContext?.setFigures(figures.map((f) => {
        if(f.id == figure.id)
        {
          return selectedFigure;
        }
        else if (f.id == selectedFigure?.id)
        {
          return figure;
        }
        return f
      }))
      appContext?.setOnClickStrategy(prevClickStrategy);

    }

    

  }
  const onClick = () => {    

    appContext?.setOnClickStrategy(new SwapStrategy());
  }




  return (
    <div>Army <button onClick={onClick}>dugme</button></div>
  )
}

export default Army