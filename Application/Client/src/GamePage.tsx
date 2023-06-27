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
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup  from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
function GamePage() {
  
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [startButtonDisabled, setStartButtonDisabled] = useState<boolean>(true);
    const [game, setGame] = useState<GameDTO>();
    const [players, setPlayers] = useState<Player[]>();
    const { id } = useParams();
    const navigate = useNavigate();
    const socketContext = useContext(SocketContext);

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
            socketContext?.on("player_joined", (player: Player) => {

                if(players == undefined){
                    setPlayers([player])
                    return;
                }

                if(game?.numbOfPlayers == (players.length + 1))
                setStartButtonDisabled(false);

            setPlayers([...players, player]);
            }) 
            socketContext?.on("game_started", (hexagons: Hexagon[]) => {
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
            navigate("/")
        }
    }
    // iznad card body  <Card.Img variant="top" src="holder.js/100px180" />

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
            {isStarted ? (<Game gameID = {game?._id} mapProp={undefined}/>) :
            (

            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Header>lobby</Card.Header>

                    <ListGroup variant="flush">
                        
                        {players?.map((player, index) => 
                        (
                        <ListGroup.Item key={index}>{player.user?.username}</ListGroup.Item>
                        ))} 
                    </ListGroup>
                    <Button variant="primary"onClick={onClick} disabled={startButtonDisabled}>Start</Button>
                </Card.Body>
            </Card>
                
            )
            }
            </Row>
        </Container>
    )

}

export default GamePage;
