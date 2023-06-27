import { Hexagon } from "../Model/Hexagon";
import { Army } from "../Model/hexagons/Army";
import { hexaSchema } from "../db/schema/HexagonSchema";
import { HexagonService } from "../services/hexagon.service";
import { PlayerService } from "../services/player.service";

export interface IMoveStrategy
{
    hs: HexagonService;


    moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any): void
}

export class PlainMoveStrategy implements IMoveStrategy {
    hs: HexagonService = new HexagonService();
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any) 
    {
      await this.hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
    }
  }


export class HexagonMoveStrategy implements IMoveStrategy 
{
    hs: HexagonService = new HexagonService();


    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any) {
        let strategy;
    
        if (hexagonDst.type == 'mine') {
          strategy = new MineMoveStrategy();
        } else if (hexagonDst.type == 'army') {
          strategy = new ArmyMoveStrategy();
        } else if (hexagonDst.type == 'castle') {
          strategy = new CastleMoveStrategy();
        } else {
          throw new Error("Nemoguci slucaj");
        }
    
        await strategy.moveLogic(gameID, hexagonSrc, hexagonDst);
      }

  }

class MineMoveStrategy extends HexagonMoveStrategy {
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any) {
      await this.hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
     
    }
  }
  
  class ArmyMoveStrategy extends HexagonMoveStrategy {
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any) {
      if (Math.random() < 1/2) { //hexagonSrc.size > hexagonDst.size
        await this.hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);

      } else {
        await this.hs.removeHexagon(gameID, hexagonSrc);
     
      }
    }
  }
  
  class CastleMoveStrategy extends HexagonMoveStrategy {
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: any) {
      if (Math.random() < 1/4) { //hexagonSrc.size > hexagonDst.size * 2

       // await this.hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
        
        let ps = new PlayerService();
        await ps.eliminatePlayer(gameID, hexagonSrc, hexagonDst); //hexagonDst._id!.toString());

      } else {
        await this.hs.removeHexagon(gameID, hexagonSrc);
      }
    }
  }
  


// This is the code that was previosly in playerService makeMove service, now if/else branches are lowered.
// if(hexagonDst.type  == 'plain')
            // {   
            //     await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
             
            // }
            // else
            // {
            //   if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "mine" || hexagonDst.type == "castle" || hexagonDst.type == 'army')) 
            //   {throw new Error("Can't move on your army, mine or castle");}

            //   //3 slucaja: vojska polje, rudnik polje, tvrdjava polje
            //   //logic for points losing, calculation...
            //   if(hexagonDst.type == "mine")
            //   {
            //     await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: if mine has defence points, calculate army vs mine point with mb probability
            //   }
            //   else if (hexagonDst.type == "army")
            //   {
            //     if (hexagonSrc.size > hexagonDst.size) //Math.random() < 1/2
            //     {
            //         await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: creating new Army
            //     }
            //     else          
            //     {
            //       await hs.removeHexagon(gameID, hexagonSrc);
            //     }
            //   }
            //   else if (hexagonDst.type == "castle")
            //   {
            //     if (hexagonSrc.size > hexagonDst.size * 2)  //Math.random() < 1/4
            //     {
            //         this.eliminatePlayer(gameID, hexagonDstID);
            //     }
            //     else          
            //     {
            //       await hs.removeHexagon(gameID, hexagonSrc);
            //     }
            //   }
            //   else {throw new Error("Nemoguci slucaj");}
            // }