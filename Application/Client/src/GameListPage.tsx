import { matchesPattern, UnaryExpression } from '@babel/types'
import React, {useEffect, useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create, getNonStartedGames, join } from './services/game.service'
import  Game from './Model/Game'


function GameListPage() {
    
    const [games, setGames] = useState<Game[]>()
    const navigate = useNavigate();

    async function getGames()
    {
        const data = await getNonStartedGames();
        
        if(!data.success)
            navigate("/");

        setGames(data.data);
    }
    useEffect(() => {

        getGames();
    }, [])
    async function onJoinClick(gameID: string | undefined)
    {
        if(!gameID) return;

        const result = await join(gameID);

        if(!result.success)
        {
            alert("greska");
            return;
        }
        navigate(`/game/${gameID}`)

    }
    async function onNewGameClick()
    {
        const result = await create();
        if(!result.success)
        {
            alert("greska");
            return;
        }
        console.log(result.data)
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