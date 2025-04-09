import { faker } from '@faker-js/faker';
import { createId } from "@paralleldrive/cuid2";
import { Player } from '@prisma/client';

export function seedPlayer(): Player {
    return {
        id: createId(),
        name: faker.person.firstName(),
        createdAt: faker.date.past()
    }
}