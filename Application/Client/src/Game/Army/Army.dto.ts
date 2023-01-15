import { Figure, FigureDto} from "../Figure.dto";

export interface ArmyDto extends FigureDto
{
    size:number    
}

export class Army extends Figure
{
    size:number;

    constructor(id: string, name: string, img: string ,type: string, size: number)
    {
        super(id, name, img, type);
        this.size = size;
    }
}