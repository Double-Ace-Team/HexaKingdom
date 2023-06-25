import { Hexagon } from "../Model/Hexagon";
import { Army } from "../Model/hexagons/Army";
import { hexaSchema } from "../db/schema/HexagonSchema";
import { HexagonService } from "../services/hexagon.service";
import { PlayerService } from "../services/player.service";

export interface IMoveStrategy
{
    hs: HexagonService;


    moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: Hexagon): void
}

export class PlainMoveStrategy implements IMoveStrategy {
    hs: HexagonService = new HexagonService();
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: Hexagon) 
    {
      await this.hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
    }
  }


export class HexagonMoveStrategy implements IMoveStrategy 
{
    hs: HexagonService = new HexagonService();


    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: Hexagon) {
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
    async moveLogic(gameID: string, hexagonSrc: Army, hexagonDst: Hexagon) {
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
        let ps = new PlayerService();
        ps.eliminatePlayer(gameID, hexagonDst._id!.toString());
      } else {
        await this.hs.removeHexagon(gameID, hexagonSrc);
      }
    }
  }
  