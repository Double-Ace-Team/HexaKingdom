import React, { useContext, useEffect, useState } from 'react'
import { Castle as CastleDTO } from '../../Model/hexagons/Castle';
import { AppContext } from '../Game';
import { createNewArmy } from '../../services/player.service';

function Castle() {

  const [castle, setCastle] = useState<CastleDTO>();
  const appContext = useContext(AppContext);

  useEffect(() => {

    setCastle(appContext?.currentHexagon);
  
  }, [])
  const onClick = () => {
    if(appContext?.currentHexagon == undefined || appContext?.GameID == null || appContext?.PlayerID == null)
    {
      alert("error");
      return;
    }
    createNewArmy(appContext?.GameID, appContext?.PlayerID);
  }
  return (
    <div>
      <div className='mt-1'>Castle</div>
      <div className='mt-3'>
       {castle?.ownerID == appContext?.PlayerID ? (<button onClick={onClick}>New Army</button>) : null}
       </div>
    </div>
  )
}

export default Castle