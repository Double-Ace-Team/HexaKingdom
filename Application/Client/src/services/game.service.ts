import {API_URL} from "../config"
import { fetchResult } from "../utils/fetch.helper";

const BASE_URL = `${API_URL}/game`;

// export async function create()
// {
//     const result = await fetchResult(`${BASE_URL}/`, {
//         method: "POST",
//         payload: comment,
//         token: localStorage.getItem("token")!
//     });
    
//     return result;
// }

export async function get(id: string)
{
    const result = await fetchResult(`${BASE_URL}/${id}`, {
        method: "POST",
        payload: {userID: localStorage.getItem("userToken")}
    })
    
    return result;
}

export async function getNonStartedGames()
{
    const result = await fetchResult(`${BASE_URL}/getNonStartedGames`, {
        method: "GET"
    })

    return result;
}

export async function join(gameID: string) {

    const result = await fetchResult(`${BASE_URL}/join`, {
        method: "PUT",
        payload: {gameID, userID: localStorage.getItem("userToken")}
    })
    
    return result;
}

export async function create(numberOfPlayers: number) {

    const result = await fetchResult(`${BASE_URL}`, {
        method: "POST",
        payload: {numberOfPlayers: numberOfPlayers, userID: localStorage.getItem("userToken")}
    })
    
    return result;
}

export async function start(gameID: string) {
    const result = await fetchResult(`${BASE_URL}/start`, {
        method: "PUT",
        payload: {gameID, userID: localStorage.getItem("userToken")}
    })
    
    return result;
}

export async function sendMessage(gameID: string, text: string){
    const result = await fetchResult(`${BASE_URL}/sendMessage`, {
        method: "PUT",
        payload: {gameID, userID: localStorage.getItem("userToken"), text: text}
    });

    return result;
}