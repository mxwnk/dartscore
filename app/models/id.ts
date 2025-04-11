import { init } from '@paralleldrive/cuid2';

export const createGameId = init({ random: Math.random, length: 5 });