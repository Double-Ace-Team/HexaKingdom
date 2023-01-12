import { UnitOfWOrk } from "../services/UnitOfWork";

export class BaseController
{
    unit: UnitOfWOrk;

    constructor()
    {
        this.unit = new UnitOfWOrk();
    }
}