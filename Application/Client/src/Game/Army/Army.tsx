import React, { useState, useEffect, useRef } from 'react'
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
  const serverMessageRef = useRef<serverMessage[]>()

  useEffect(() => {
    setPrevClickStrategy(appContext?.onClickStrategy);
    console.log(appContext?.onClickStrategy)
  }, [appContext?.onClickStrategy])

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


    async onClick(index: number, hexagons: Hexagon[]) {
      
      const hexagon = hexagons[index];
      //console.log(hexagon)


      appContext?.setHexagons(appContext?.hexagons.map((hex:Hexagon) => {    
        hex.opacity = 1
        return hex
      }));



      if(appContext?.currentHexagon == undefined)
      {
        alert("error swap tile");//throw new Error('Method not implemented.');
        return;
      }


      //const selectedHexagon: Hexagon = appContext?.currentHexagon!;
 

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

      const result = await makeMove(appContext?.GameID, appContext?.currentHexagon, hexagon, appContext?.PlayerID);
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
      if(!result.success){
        if(serverMessageRef.current == undefined) return
        
        let serverMessage: serverMessage[] = serverMessageRef.current;
        let index = Math.ceil(Math.random() * 10000000)
        serverMessage.push({id: index, text: result.error.message});
        appContext?.setServerMessage(serverMessage);

        // let serverMessageClass: serverMessage[] = appContext?.serverMessageClass;
        // serverMessageClass.push({id: index, text:"fade-in"});
        // appContext?.setServerMessageClass(serverMessageClass)
        // console.log(serverMessageClass)

        setTimeout(() => {
            appContext?.setServerMessage([])

          // console.log(appContext?.serverMessageClass.map((message, i) => {
          //   if(message.id != index)
          //     return message
          //   else
          //     return {id: message.id, text: "fade-out"}

          // }))
          // appContext?.setServerMessageClass(appContext?.serverMessageClass.map((message, i) => {
          //   if(message.id != index)
          //     return message
          //   else
          //     return {id: message.id, text: "fade-out"}

          // }))
          // setTimeout(() => {
          //   appContext?.setServerMessage(appContext?.serverMessage.filter((message) => message.id != index))
          //   appContext?.setServerMessageClass(appContext?.serverMessageClass.filter((message) => message.id != index))
           
          // }, 2000)
        }, 4000)
      }

      appContext.currentHexagon = undefined;

      appContext?.setCurrentHexagon(undefined);

      appContext?.setOnClickStrategy(prevClickStrategy);


    }

    

  }
  const onClick = () => {    

    appContext?.setOnClickStrategy(new SwapStrategy());
  }

  useEffect(() => {
    console.log(appContext?.PlayerID)
    console.log(appContext?.currentHexagon)
  }, [])


  return (
    <div>Army {appContext?.PlayerID == appContext?.currentHexagon?.ownerID ? (<button onClick={onClick}>dugme</button>) : null}</div>
  )
}

export default Army