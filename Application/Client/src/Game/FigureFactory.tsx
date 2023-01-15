import React, { useEffect } from 'react'
import Army from './Army/Army';
import { Figure } from './Figure.dto';
import { useContext } from 'react';
interface Props
{
    figure: Figure | undefined;
}

function FigureFactory(props: Props) {
  useEffect(() => {
    console.log("Figurefact:")
    console.log(props.figure);
  }, [])
  return (
    <div>
        {(props.figure?.type == "army") ? (<Army />) : (<h2>"test2</h2>)}
    </div>
  )
}

export default FigureFactory