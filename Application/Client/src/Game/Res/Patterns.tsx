import React from 'react'
import { Pattern } from 'react-hexgrid'
import pic from './grass.jpg';
import sword from './sword.png';
import sword2 from './sword2.png';

interface Props
{
  hexagonSize: {x:number, y:number};

}

function Patterns(props: Props) {
  return (
    <>
            <Pattern id="pat-1" link={pic} size={props.hexagonSize} />
            <Pattern id="sword1" link={sword} size={props.hexagonSize} />
            <Pattern id="sword2" link={sword2} size={props.hexagonSize} />

    </>
  )
}

export default Patterns