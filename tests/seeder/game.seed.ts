import { GameState } from "@/app/models/game";
import { generateMany } from "./helpers";
import { generatePlayer } from "./player.seed";
import { faker } from '@faker-js/faker';
import { DartGame } from "@/app/domain/dart-game";

export function seedGame(defaults?: Partial<GameState>): DartGame {
    const players = generateMany({ count: 1, fn: generatePlayer });
    const state = {
        id: faker.string.uuid(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        checkout: faker.helpers.arrayElement(["Double", "Straight"]),
        startpoints: 301,
        turns: [],
        players,
        ...defaults
    }
    return DartGame.fromGameState(state);
}
