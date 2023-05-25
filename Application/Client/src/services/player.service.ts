import Game from "../Model/Game";
import { Hexagon } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import {API_URL} from "../config"
import { fetchResult } from "../utils/fetch.helper";

const BASE_URL = `${API_URL}/player`;

export async function makeMove(gameID: string, hexagonSrc: Hexagon, hexagonDst: Hexagon, playerID: string) {

    const result = await fetchResult(`${BASE_URL}/makeMove`, {
        method: "PUT",
        payload: {gameID: gameID, hexagonSrcID: hexagonSrc._id, hexagonDstID: hexagonDst._id, playerID: playerID, points: 20, userID: localStorage.getItem("userToken")}
    })
    return result;
}
export async function endTurn(gameID: string, playerID: string) {

    const result = await fetchResult(`${BASE_URL}/endTurn`, {
        method: "PUT",
        payload: {gameID: gameID, playerID: playerID, userID: localStorage.getItem("userToken")}
    })

    return result;
}

export async function createNewArmy(gameID: string, playerID: string){
    const result = await fetchResult(`${BASE_URL}/createNewArmy`, {
        method: "PUT",
        payload: {gameID: gameID, playerID: playerID, userID: localStorage.getItem("userToken")}
    })

    return result;
}