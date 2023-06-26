import React, { useState, useEffect, useRef } from 'react'
//import { Figure } from '../Figure.dto';
import { OnClickStrategy } from '../OnClickStrategy';
import { useContext } from 'react';
import { AppContext } from '../Game';
import { Hexagon } from '../../Model/Hexagon';
import { makeMove } from '../../services/player.service';
import {Army as ArmyDTO} from '../../Model/hexagons/Army';

function Army() {
  
  const appContext = useContext(AppContext);
  const [prevClickStrategy, setPrevClickStrategy] = useState();
  const serverMessageRef = useRef<serverMessage[]>()
  const [army, setArmy] = useState<ArmyDTO>();

  useEffect(() => {
    setArmy(appContext?.currentHexagon);

    if(appContext?.PlayerID == appContext?.currentHexagon?.ownerID)
    {
      let previousStrategy = appContext?.onClickStrategy;

      appContext?.setOnClickStrategy(new SwapStrategy());
      
      setPrevClickStrategy(previousStrategy);
    }


  }, [appContext?.currentHexagon])
  
  useEffect(() => {
    if(appContext?.serverMessage)
      serverMessageRef.current = appContext.serverMessage
  }, [appContext?.serverMessage])


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

  interface serverMessage
  {
    id: number;
    text: string;
  }

  class SwapStrategy extends OnClickStrategy
  {

    private prevClickStrategy:OnClickStrategy;
    
    constructor()
    {

      super();

      this.prevClickStrategy = appContext?.onClickStrategy;
      
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

        hexas.forEach(h => {
            if(JSON.stringify(h) === JSON.stringify(hexaTarget))
            {
                hexaDst.opacity = 0.5
            }
        });

        return hexaDst
      }))

    }


    async onClick(index: number, hexagons: Hexagon[]) {
      
      const hexagon:Hexagon = hexagons[index];
 
      if(appContext?.currentHexagon == undefined || appContext?.GameID == null || appContext?.PlayerID == null)
      {
        alert("error")
        this.returnStrategy();
        return;
      }


      const result = await makeMove(appContext?.GameID, appContext?.currentHexagon, hexagon, appContext?.PlayerID);

      if(!result.success)
      {
    //    this.returnStrategy();
        if(serverMessageRef.current != undefined) 
        {
          let serverMessage: serverMessage[] = serverMessageRef.current;
          let index = Math.ceil(Math.random() * 10000000)
          serverMessage.push({id: index, text: result.error.message});
          appContext?.setServerMessage(serverMessage);


          setTimeout(() => {
              appContext?.setServerMessage([])

          }, 4000)
        }
      }
      

      this.returnStrategy();
    }

    returnStrategy(){
      appContext?.setHexagons(appContext?.hexagons.map((hex:Hexagon) => {    
        hex.opacity = 1
        return hex
      }));
      appContext?.setCurrentHexagon(undefined);
      appContext?.setOnClickStrategy(this.prevClickStrategy);
    }

  }


  return (
    <div>Army
    {appContext?.PlayerID == army?.ownerID ? (<p>Moves left: {army?.moves}</p>) : null}
    {//<img src={require(`../Res/{}.png`).default} alt="" height={100} width={100} />
}
    </div>
  )
}

export default Army