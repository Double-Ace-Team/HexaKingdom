import React, { useEffect } from 'react'
import Army from './Army/Army';
//import { Figure } from './Figure.dto';
import { useContext } from 'react';
import { Hexagon } from '../Model/Hexagon';

interface Props
{
    hexagon: Hexagon | undefined;
}

function FigureFactory(props: Props) {
  useEffect(() => {
    console.log("Figurefact:")
    console.log(props.hexagon);
  }, [])
  return (
    <div>
        {(props.hexagon?.type == "army") ? (<Army />) : (<h2>"test2</h2>)}
    </div>
  )
}

export default FigureFactory