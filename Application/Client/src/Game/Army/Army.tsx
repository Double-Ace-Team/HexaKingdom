import React, { useState, useEffect } from 'react'
//import { Figure } from '../Figure.dto';
import { OnClickStrategy } from '../OnClickStrategy';
//import { ArmyDto } from './Army.dto'
import { useContext } from 'react';
import { AppContext } from '../Game';
import { Hexagon } from '../../Model/Hexagon';
import { makeMove } from '../../services/player.service';
function Army() {
  
  const appContext = useContext(AppContext);
  const [prevClickStrategy, setPrevClickStrategy] = useState();

  useEffect(() => {
    setPrevClickStrategy(appContext?.onClickStrategy);
    console.log(appContext?.onClickStrategy)
  }, [appContext?.onClickStrategy])


  class Hexa
  {
      q: number;
      r: number;
      s: number;
  
      constructor(q: number,s: number,r: number)
      {
          this.q = q;
          this.r = r;
          this.s = s;
      }
  }



  class SwapStrategy extends OnClickStrategy
  {
    constructor()
    {
      


      super();
      let hexaSrc = appContext?.currentHexagon;

      let hexas: Hexa[] = new Array<Hexa>;
        
      hexas.push(new Hexa(hexaSrc.q + 1, hexaSrc.r + 0, hexaSrc.s - 1));
      hexas.push(new Hexa(hexaSrc.q + 1, hexaSrc.r - 1, hexaSrc.s + 0 ));
      hexas.push(new Hexa(hexaSrc.q + 0, hexaSrc.r - 1, hexaSrc.s + 1 ));
      hexas.push(new Hexa(hexaSrc.q + 0, hexaSrc.r + 1, hexaSrc.s - 1 ));
      hexas.push(new Hexa(hexaSrc.q - 1, hexaSrc.r + 0 , hexaSrc.s + 1 ));
      hexas.push(new Hexa(hexaSrc.q - 1, hexaSrc.r + 1, hexaSrc.s + 0 ));

      appContext?.setHexagons(appContext?.hexagons.map((hexaDst:any) => {    


        let hexaTarget: Hexa = new Hexa(hexaDst.q, hexaDst.r, hexaDst.s);
        let flag: boolean = false;
        hexas.forEach(h => {
            if(JSON.stringify(h) === JSON.stringify(hexaTarget))
            {
                hexaDst.opacity = 0.5
            }
        });
        return hexaDst
      }))
    }


    onClick(index: number, hexagons: Hexagon[]): void {
      
      const hexagon = hexagons[index];
      //console.log(hexagon)



      if(appContext?.currentHexagon == undefined)
      {
        alert("error swap tile");//throw new Error('Method not implemented.');
        return;
      }


      //const selectedHexagon: Hexagon = appContext?.currentHexagon!;
      console.log(appContext?.GameID)
      console.log(appContext?.PlayerID)

      if(appContext?.GameID == null)
      {
        alert("error")
        return;
      }
      if(appContext?.PlayerID == null)
      {
        alert("error")
        return
      }

      makeMove(appContext?.GameID, appContext?.currentHexagon, hexagon, appContext?.PlayerID);
      // appContext?.setHexagons(hexagons.map((h) => {
      //   if(h._id == hexagon._id)
      //   {
      //     return selectedHexagon;
      //   }
      //   else if (h._id == selectedHexagon?._id)
      //   {
      //     return hexagon;
      //   }
      //   return h;
      // }))
      appContext.currentHexagon = undefined;

      appContext?.setCurrentHexagon(undefined);

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