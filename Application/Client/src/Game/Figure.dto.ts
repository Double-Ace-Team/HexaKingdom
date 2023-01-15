import { type } from "os";
import { NumberLiteralType } from "typescript";

export interface FigureDto
{
    id: number;
    name: string;
    img: string;
    type: string;
}

export class Figure
{
  id: string;
  name: string;
  img: string;
  type: string;
  
  constructor(id: string, name: string, img: string ,type: string)
  {
    this.id = id;
    this.name = name;
    this.img = img;
    this.type = type;
  }

  onClick()
  {
    console.log("test")
  }
}
/*
class Person{
  name:string;
  tip:string
  constructor(json: string[])
  {
    this.tip = json["tip"];
    this.name = json["ime"];
  }
}

let persona:Person = new Person(JSON.parse(JSON.stringify({"tip": "tip12", "ime": "ime12"})))

console.log(persona)
*/