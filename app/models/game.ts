import { ThenArg } from "../utils/promise";
import { getGameById } from "../db/actions";

export type GameDto = ThenArg<ReturnType<typeof getGameById>>
