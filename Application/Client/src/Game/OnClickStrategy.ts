import { Figure } from "./Figure.dto";

export abstract class OnClickStrategy
{
    abstract onClick(index: number, figures: Figure[]): void;
}