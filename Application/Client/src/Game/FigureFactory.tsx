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
    // console.log("Figurefact:")
    // console.log(props.hexagon);
  }, [])
  return (
    <div>
        {(props.hexagon?.type == "army") ? (<div> <Army /> <img className='mt-1' src={require(`./Res/${props.hexagon.img}.png`)} alt="" height={100} width={100} /> </div>) : null}
        {(props.hexagon?.type == "castle") ? (<div> <Castle />  <img className='mt-1'src={require(`./Res/${props.hexagon.img}.png`)} alt="" height={100} width={100} /></div>) : null}
        {(props.hexagon?.type == "plain") ? (<div> <div>Plain</div> <img className='mt-1' src={require("./Res/grass.jpg")} alt="" height={100} width={100} /></div>) : null}
        {(props.hexagon?.type == "mine") ? (<div> <div>Mine</div> <img className='mt-1' src={require(`./Res/${props.hexagon.img}.png`)} alt="" height={100} width={100} /></div> ) : null}

    </div>
  )
}

export default FigureFactory