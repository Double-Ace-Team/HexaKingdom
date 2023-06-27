import { matchesPattern, UnaryExpression } from '@babel/types'
import React, {useContext, useEffect, useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { create, getNonStartedGames, join } from './services/game.service'
import  Game from './Model/Game'
import { SocketContext } from './App'

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/esm/Form'
import { Button, Col, Container, Row } from 'react-bootstrap'

function GameListPage() {
    
    const [games, setGames] = useState<any[]>();

    const [newGameMap, setNewGameMap] = useState<string>("testMap");
    const [newGameSize, setNewGameSize] = useState<number>(2);
    const [showNewGameForm, setShowNewGameForm] = useState<boolean>(false);
    const navigate = useNavigate();

    const socketContext = useContext(SocketContext);
    
    async function getGames()
    {
        const data = await getNonStartedGames();
        console.log(data)
        if(!data.success)
            navigate("/");
        
        setGames(data.data);
    }
    function addGame(game: Game)
    {
        let findGame = games?.find(element => element._id == game._id)
        if(findGame && games)
        {
            let newGames: any[] = games.map((g) =>{
                            if(g._id == game._id)
                                g.players = game.players;
                            return g;
            });
            setGames(newGames);
        }
        else if(games != undefined)
        {
            setGames([...games, game]);
        }
        else
            setGames([game])
    }

    useEffect(() => {
        getGames();
    }, [])

    
    useEffect(() => {

        socketContext?.on("new_game_created", (game:Game) => {
            console.log(game);
            addGame(game);
        })

        return () => {
            socketContext?.off("new_game_created");
        }
    }, [games])

    const handleCreateGame = async (event: React.FormEvent) => {
            event.preventDefault();
            if(!newGameSize)
            {
                alert("Game size not set");
                return;
            }
            const result = await create(newGameSize);
            if(!result.success)
            {
                alert("greska");
                return;
            }
            localStorage.setItem("currentGame", result.data._id);
            localStorage.setItem("currentPlayer", result.data.playerID);
    
            navigate(`/game/${result.data._id}`)

    }
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
        const result = await create(newGameSize);
        if(!result.success)
        {
            alert("greska");
            return;
        }
        localStorage.setItem("currentGame", result.data._id);
        localStorage.setItem("currentPlayer", result.data.playerID);

        navigate(`/game/${result.data._id}`)
    }//            {games?.map((game, index) => (<div key={index}>{game._id} <button onClick={() => onJoinClick(game._id)}>Join</button> </div>))} 

    return (
        <Container>
        <Row>
            <Table striped="columns">
            <thead>
                <tr>
                <th>#</th>
                <th>GameID</th>
                <th>Host</th>
                <th>Number of Players</th>
                <th>Map</th>
                </tr>
            </thead>
            <tbody>
                {games?.map((game, index) => (
                <tr key={index}>
                    <td>{index}.</td>
                    <td>{game._id} </td>
                    <td>{game.userCreatedID?.username}</td>
                    <td>{game.players?.length + '/' + game.numbOfPlayers}</td>
                    <td> <button onClick={() => onJoinClick(game._id)}>Join</button> </td>
                
                </tr>))} 
            </tbody>
            </Table>
        </Row>
        <Row className="justify-content-md-center">
            <Col xs={4}>
                <Button variant="primary" onClick={() => {setShowNewGameForm(!showNewGameForm)}}>New Game</Button>
                {showNewGameForm ?   
                <Form onSubmit={handleCreateGame}>

                    <Form.Group>
                        <Form.Label>Game size:</Form.Label>
                        <Form.Select value={newGameSize} onChange={(e: any) => {setNewGameSize(e.target.value)}}>
                        <option value={2}>2</option>
                        <option value={4}>4</option>                      
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Game map:</Form.Label>
                        <Form.Select value={newGameMap} onChange={(e: any) => {setNewGameMap(e.target.value)}}>
                        <option value={"testMap"}>testMap</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit">Create new Game</Button>
                </Form> : null }
            </Col>
        </Row> 
        </Container>
        

    )
}

export default GameListPage