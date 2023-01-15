import { Figure, FigureDto } from "./Figure.dto"
import { Army, ArmyDto } from "./Army/Army.dto";

export const figureTypes: string[] = ["Army", "Castle", "..."];
//nije factory pattern
export function createFigure(type:string, data:any): Figure
{
    let figure: Figure = new Figure(data.id, data.name, data.img, "def");
    if(type == "army")
    {
        figure = new Army(data.id, data.name, data.img, "army", data.size);
    }

    return figure;
}