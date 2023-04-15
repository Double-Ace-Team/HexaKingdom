import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { get, start } from './services/game.service';
import Game from './Game/Game';
import GameDTO from './Model/Game'
import { SocketContext } from './App';
import { Player } from './Model/Player';
import { User } from './Model/User';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import { Hexagon } from './Model/Hexagon';
function GamePage() {
  
    const [isStarted, setIsStarted] = useState<boolean>(false)
    const [game, setGame] = useState<GameDTO>()
    const [players, setPlayers] = useState<Player[]>()
    const { id } = useParams();
    const navigate = useNavigate();
    const socketContext = useContext(SocketContext)

    function somebodyJoinedGame()
    {
        console.log(players);


    }
    async function getGame() {

        if(!id) return

        const data = await get(id)

        if(!data.success) return

        setGame(data.data)
        setPlayers(data.data.players)
        socketContext?.emit("join_room", data.data._id);
        setIsStarted(data.data.isStarted)

    }
    useEffect(() => {
        if(players!=undefined){
            console.log("TEST1")
            socketContext?.on("player_joined", (player: Player) => {
                alert("playerjoined")
                console.log(player);
                if(players == undefined){
                    console.log(players)
                    setPlayers([player])
                    return;
                } 
                
            setPlayers([...players, player]);
            }) 
            socketContext?.on("game_started", (hexagons: Hexagon[]) => {
                console.log(hexagons);
                window.location.reload();
                //navigate(`/game/${game?._id}`)
            })
        }else
        {
            getGame()
        }


        return () => {
            socketContext?.off("game_started");
            socketContext?.off("player_joined");
        }
    }, [players])
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
            alert("Super");
            navigate("/")
        }
    }
    return (
        <div>
            {isStarted ? (<Game mapProp={undefined}/>) : (<div>lobby player:{players?.map((player, index) => (<div key={index} >{player.user?.username} </div>) )} <button onClick={onClick}>Start</button></div>)}
        </div>
    )

}

export default GamePage;
