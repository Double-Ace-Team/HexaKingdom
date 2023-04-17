import { matchesPattern, UnaryExpression } from '@babel/types'
import React, {useContext, useEffect, useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create, getNonStartedGames, join } from './services/game.service'
import  Game from './Model/Game'
import { SocketContext } from './App'


function GameListPage() {
    
    const [games, setGames] = useState<Game[]>()
    const navigate = useNavigate();
    const socketContext = useContext(SocketContext)
    
    async function getGames()
    {
        const data = await getNonStartedGames();
        
        if(!data.success)
            navigate("/");

        setGames(data.data);
    }
    function addGame(game: Game)
    {
        if(games != undefined)
            setGames([...games, game]);
        else
            setGames([game])
    }

    useEffect(() => {
        getGames();
    }, [])

    
    useEffect(() => {

        socketContext?.on("new_game_created", (game:Game) => {
            addGame(game);
        })

        return () => {
            socketContext?.off("new_game_created");
        }
    }, [games])


    async function onJoinClick(gameID: string | undefined)
    {
        if(!gameID) return;

        const result = await join(gameID);

        if(!result.success)
        {
            alert("greska");
            return;
        }
       
        localStorage.setItem("currentGame", gameID);
        localStorage.setItem("currentPlayer", result.data.playerID);

        socketContext?.emit('join_game', gameID);//mozda visak, postoji duplikat u gamepage nakon ulaska u game

        navigate(`/game/${gameID}`);

    }
    async function onNewGameClick()
    {
        const result = await create();
        if(!result.success)
        {
            alert("greska");
            return;
        }
        localStorage.setItem("currentGame", result.data._id);
        localStorage.setItem("currentPlayer", result.data.playerID);

        navigate(`/game/${result.data._id}`)
    }
    return (
        <div>
            {games?.map((game, index) => (<div key={index}>{game._id} <button onClick={() => onJoinClick(game._id)}>Join</button> </div>))} 

            <button onClick={onNewGameClick}>new game</button>
        </div>
    )
}

export default GameListPage