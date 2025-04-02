import { ThenArg } from "../utils/promise";
import { getGameById } from "../db/actions";

export type GameState = ThenArg<ReturnType<typeof getGameById>>
