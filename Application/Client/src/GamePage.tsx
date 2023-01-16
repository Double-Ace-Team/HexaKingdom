import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { get, start } from './services/game.service';
import Game from './Game/Game';
import GameDTO from './Model/Game'
function GamePage() {
  
    const [isStarted, setIsStarted] = useState<boolean>(false)
    const [game, setGame] = useState<GameDTO>()
    const { id } = useParams();
    const navigate = useNavigate();


    async function getGame() {

        if(!id) return

        const data = await get(id)

        if(!data.success) return

        setGame(data.data)

        setIsStarted(data.data.isStarted)

    }
    useEffect(() => {
      getGame()
    }, [])
    async function onClick()
    {
        if(!id)
        {
            alert("Greska")
            return;
        }
        const result = await start(id);
        if(result.success)
        {
            console.log(result.data);
            alert("Super");
            navigate("/")
        }
    }
    return (
        <div>
            {isStarted ? (<Game/>) : (<div>lobby player:{game?.players.map((player, index) => (<div key={index} >{player.user?.username} </div>) )} <button onClick={onClick}>Start</button></div>)}
        </div>
    )

}

export default GamePage;
