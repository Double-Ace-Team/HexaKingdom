import React, { useEffect } from 'react'
import Army from './Figures/Army';
//import { Figure } from './Figure.dto';
import { useContext } from 'react';
import { Hexagon } from '../Model/Hexagon';
import Castle from './Figures/Castle';

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
        {(props.hexagon?.type == "army") ? (<Army />) : null}
        {(props.hexagon?.type == "castle") ? (<Castle />) : null}
        {(props.hexagon?.type == "plain") ? (<p>plain</p>) : null}

    </div>
  )
}

export default FigureFactory