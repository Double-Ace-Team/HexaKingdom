import { Hexagon } from "../Model/Hexagon";

export abstract class OnClickStrategy
{
    abstract onClick(index: number, hexagons: Hexagon[]): void;
}