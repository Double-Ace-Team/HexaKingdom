import {API_URL} from "../config"
import { fetchResult } from "../utils/fetch.helper";

const BASE_URL = `${API_URL}/user`;


export async function login(payload: {username: string, password: string})
{
    const result = await fetchResult(`${BASE_URL}/login`, {
        method: "POST",
        payload: payload
    })

    return result;
}

export async function register(payload: {username: string, password: string})
{
    const result = await fetchResult(`${BASE_URL}/`, {
        method: "POST",
        payload: {user: payload}
    })

    return result;
}

