import React, { createContext, useCallback, useContext } from 'react';
import logo from './logo.svg';
import pic from './Res/grass.jpg';
import sword from './Res/sword.png';
import { useState, useEffect } from 'react';
import './Game.css';
import {GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
//import { Figure} from './Figure.dto';
//import { createFigure } from './FigureFactoryDto';
import FigureFactory from './FigureFactory';
import { OnClickStrategy } from './OnClickStrategy';
import { Hexagon as HexaData} from '../Model/Hexagon';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../App';
import { get, start } from '../services/game.service';
import GameDTO from '../Model/Game'
import { createHexagon } from './HexagonFactoryDto';
import { endTurn } from '../services/player.service';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup  from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Patterns from './Patterns';
import MessageBox from './MessageBox';



//NOTE: Figure == hexagon == HexaData

interface serverMessage
{
  id: number;
  text: string;
}
interface AppContextInterface 
{
  onClickStrategy: any;
  setOnClickStrategy: any;
  setCurrentHexagon: any;
  currentHexagon: any;
  setHexagons: any;
  hexagons: any;
  setServerMessage: any;
  serverMessage: serverMessage[];
  setServerMessageClass: any;
  serverMessageClass: serverMessage[];
  PlayerID: string | null;
  GameID: string | null;
}

interface Props
{
  gameID: string | undefined;
  mapProp: HexaData[] | undefined;
}

export const AppContext = createContext<AppContextInterface | null>(null);

function Game(props: Props) {
  
  class SelectStrategy extends OnClickStrategy //bolje da su static?
  {
    constructor()
    {
      //setHexagons(hexagons.map((hex) => {hex.opacity = 1; return hex}))
      super();

    }
    onClick(index: number, hexagons: HexaData[]): void {
      setCurrentHexagon(hexagons[index]);
      //console.log("selectstrategy")
    }
    
  }

  const [hexagons, setHexagons] = useState([] as HexaData[]);
  const [game, setGame] = useState<GameDTO>();
  const [onClickStrategy, setOnClickStrategy] = useState<OnClickStrategy | undefined>(undefined);
  const [currentHexagon, setCurrentHexagon] = useState<HexaData>();
  const [serverMessage, setServerMessage] = useState<serverMessage[]>([]);
  const [serverMessageClass, setServerMessageClass] = useState<serverMessage[]>([])
  const hexagonSize = { x: 10, y: 10 };
  //const moreHexas = GridGenerator.orientedRectangle(5, 5);
  const navigate = useNavigate();
  const socketContext = useContext(SocketContext)


  async function updateGame() {
    if(!props.gameID) throw new Error("no game ID")

    const data = await get(props.gameID)

    if(!data.success) return
    //console.log(data.data)
    setGame(data.data)

    
    let newHexagons: HexaData[] = new Array<HexaData>();
    console.log(data.data)
    for(let i = 0; i < data.data.hexagons.length; i++)
    {      
      newHexagons.push(createHexagon(data.data.hexagons[i].type, data.data.hexagons[i], data.data.players));

    }
 
    setHexagons(newHexagons);
    //setPlayers(data.data.players)
    //socketContext?.emit("join_room", data.data._id);
    //setIsStarted(data.data.isStarted)
  }

  async function endTurnOnClick()
  {
    const data = await endTurn(game?._id!, localStorage.getItem("currentPlayer")!);
    if(!data.success) return;

  }
  useEffect(() => {
    //let figures: HexaData[] = [];
    console.log(game);
    setOnClickStrategy(new SelectStrategy())
    // for(let i = 0; i < 25; i++)
    // {
    //   if(i == 10)
    //     figures.push(createFigure("army", {"id":i, "name": "testARMY", "img": "pat-2","type": "army", "size": 100}));
    //   else
    //     figures.push(createFigure("plain", {"id":i,"name": "plain" + i,"img": "pat-1", "type": "grass"}));
    // } s
    updateGame()
    //setHexagons(figures);

  }, [])

  useEffect(() => {
    socketContext?.on("update_game", () => {
      updateGame();
    })
    socketContext?.on("leave_game", (playerID: string) => {
      if(AppContextValue.PlayerID == playerID)
      {
        alert("GAME OVER")
        navigate('/')
      }
    })
    return () => {
        socketContext?.off("update_game");
        socketContext?.off("leave_game");
    }
  }, [])

  const AppContextValue: AppContextInterface = { 
                                                onClickStrategy:onClickStrategy, setOnClickStrategy : setOnClickStrategy, 
                                                setHexagons: setHexagons, hexagons: hexagons,
                                                currentHexagon: currentHexagon, setCurrentHexagon: setCurrentHexagon, 
                                                PlayerID: localStorage.getItem("currentPlayer"),
                                                GameID: localStorage.getItem("currentGame"),
                                                setServerMessage: setServerMessage, serverMessage: serverMessage, 
                                                setServerMessageClass: setServerMessageClass, serverMessageClass: serverMessageClass
              
  }
return (        

  <Container className="Game">
      
      <AppContext.Provider value={AppContextValue}>
      <Row>
        <Col md={3}>         
          <Container>
            <MessageBox gameID={game?._id} poruke={game?.messages} />
          </Container>
        </Col>
        <Col md={6} style={{ "height": "100vh", "backgroundColor": "#eee", "margin": "0 auto"}}>
            <HexGrid width={"100%"} viewBox="-20 -10 100 100">
              {/* Main grid with bit hexagons, all manual */}

              {/* Additional small grid, hexagons generated with generator */}
              <Layout size={hexagonSize} origin={{ x: 0, y: 0 }}>
                { hexagons.map((hex, i) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} style={{ fill: "red", border: "2px solid black", fillOpacity: hex.opacity, }} fill={hexagons[i]?.img} onClick={() => {onClickStrategy?.onClick(i, hexagons)}} />) }
              </Layout>

              {/* You can define multiple patterns and switch between them with "fill" prop on Hexagon // insert images here*/}
              {/* <Pattern id="pat-1" link={pic} size={hexagonSize} />
              <Pattern id="pat-2" link={sword} size={hexagonSize} /> */}
              <Patterns hexagonSize={hexagonSize}/>
              {/* insert functions here */}

            </HexGrid>
        </Col>

        <Col md={3} >
          
          {/*<p>Currently selected tile: {currentHexagon?._id} </p>*/}
          
          <Row  className="justify-content-md-center mt-3">
            <p>Current resources: {game?.players.find(player => player._id == AppContextValue.PlayerID)?.resources}</p>
          </Row>
          
          <FigureFactory hexagon={currentHexagon} />
                    
          <Row  className="justify-content-md-center mt-3">
            {AppContextValue.PlayerID == game?.turnForPlayerID ? (<button style={{"width": "30%"}}onClick={endTurnOnClick}>End turn</button>) : (<p>Wait for your turn</p>)}
          </Row>
          {serverMessage.map((message, i) =>  (<p key={i} className={`serverMessage ${serverMessageClass.find((msgClass) => msgClass.id == message.id)?.text}`}>{message.text}</p>))}

        </Col>
      </Row>
      </AppContext.Provider>
      
    </Container>
  );
}

export default Game;
