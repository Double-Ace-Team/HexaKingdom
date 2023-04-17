import Game from "../Model/Game";
import { Hexagon } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import {API_URL} from "../config"
import { fetchResult } from "../utils/fetch.helper";

const BASE_URL = `${API_URL}/player`;

export async function makeMove(gameID: string, hexagonSrc: Hexagon, hexagonDst: Hexagon, playerID: string) {

    const result = await fetchResult(`${BASE_URL}/makeMove`, {
        method: "PUT",
        payload: {gameID: gameID, hexagonSrc: hexagonSrc, hexagonDst: hexagonDst, playerID: playerID, points: 20, userID: localStorage.getItem("userToken")}
    })

    return result;
}