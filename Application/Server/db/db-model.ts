import mongoose from "mongoose";
import { gameSchema } from "./schema/GameSchema";
import { armySchema } from "./schema/Hexagons/ArmySchema";
import { castleSchema } from "./schema/Hexagons/CastleSchema";
import { mineSchema } from "./schema/Hexagons/MineSchema";
import { hexaSchema } from "./schema/HexagonSchema";
import { playerSchema } from "./schema/PlayerSchema";
import { userSchema } from "./schema/UserSchema";

const gamesDB = mongoose.model('games', gameSchema);
//const hexasDB = mongoose.model('hexas', hexaSchema);
const playersDB = mongoose.model('players', playerSchema);
const usersDB = mongoose.model('users', userSchema);
const armiesDB = hexaSchema.discriminator("army", armySchema);
const castlesDB = hexaSchema.discriminator("castle", castleSchema);
const minesDB = hexaSchema.discriminator("mine", mineSchema);
const plainsDB = hexaSchema.discriminator("plain", hexaSchema);

export
{
    gamesDB,
    //hexasDB,
    playersDB,
    usersDB,
    armiesDB,
    castlesDB,
    minesDB,
    plainsDB
}