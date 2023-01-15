import React, { useState } from 'react'
import Game from './Game/Game';

function GamePage() {
  
    const [isStarted, setIsStarted] = useState(true)
    return (
        <div>
            {isStarted ? (<Game/>) : (<div>lobby</div>)}
        </div>
    )

}

export default GamePage;
