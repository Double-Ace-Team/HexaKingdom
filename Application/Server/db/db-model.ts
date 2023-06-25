import mongoose from "mongoose";
import { gameSchema } from "./schema/GameSchema";
import { armySchema } from "./schema/Hexagons/ArmySchema";
import { castleSchema } from "./schema/Hexagons/CastleSchema";
import { mineSchema } from "./schema/Hexagons/MineSchema";
import { hexaSchema } from "./schema/HexagonSchema";
import { playerSchema } from "./schema/PlayerSchema";
import { userSchema } from "./schema/UserSchema";
import { messageSchema } from "./schema/MessageSchema";



const gamesDB = mongoose.model('games', gameSchema);
const messageDB = mongoose.model('messages', messageSchema);
const hexasDB = mongoose.model('hexas', hexaSchema);
const playersDB = mongoose.model('players', playerSchema);
const usersDB = mongoose.model('users', userSchema);
const armiesDB = hexasDB.discriminator("army", armySchema);
const castlesDB = hexasDB.discriminator("castle", castleSchema);
const minesDB = hexasDB.discriminator("mine", mineSchema);
const plainsDB = hexasDB.discriminator("plain", hexaSchema);
export
{
    gamesDB,
    //hexasDB,
    messageDB,
    playersDB,
    usersDB,
    armiesDB,
    castlesDB,
    minesDB,
    plainsDB
}