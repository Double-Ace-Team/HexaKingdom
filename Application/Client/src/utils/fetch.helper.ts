interface HeaderRequest {
    method: string;
    headers: {
        "Content-Type": string;
        Authorization?: string;
    }
    body?: any;
}

interface HeaderPayload {
    method: string;
    payload?: any;
    token?: string;
}

function getHeader({method, payload, token}: HeaderPayload)
{
    const headerRequest: HeaderRequest = {
        method,
        headers: {
            "Content-Type": 'application/json',
            Authorization: token
        },
        body: JSON.stringify(payload)
    };

    return headerRequest;
}

export async function fetchResult(url: string, headerPayload: HeaderPayload)
{
    const result = await fetch(url, getHeader(headerPayload));

    const data = await result.json();

    return data;
}