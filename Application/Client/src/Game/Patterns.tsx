import React from 'react'
import { Pattern } from 'react-hexgrid'
import grass from './Res/grass.jpg';
import sword1 from './Res/sword1.png';
import sword2 from './Res/sword2.png';
import mine1 from './Res/mine1.png';
import mine2 from './Res/mine2.png';
import tower1 from './Res/tower1.png';
import tower2 from './Res/tower2.png';


interface Props
{
  hexagonSize: {x:number, y:number};

}

function Patterns(props: Props) {
  return (
    <>
            <Pattern id="grass" link={grass} size={props.hexagonSize} />
            <Pattern id="sword1" link={sword1} size={props.hexagonSize} />
            <Pattern id="sword2" link={sword2} size={props.hexagonSize} />
            <Pattern id="mine1" link={mine1} size={props.hexagonSize} />
            <Pattern id="mine2" link={mine2} size={props.hexagonSize} />
            <Pattern id="tower1" link={tower1} size={props.hexagonSize} />
            <Pattern id="tower2" link={tower2} size={props.hexagonSize} />

    </>
  )
}

export default Patterns