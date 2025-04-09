import { PlayerDto } from "@/app/models/player";
import { faker } from '@faker-js/faker';
import { createId } from "@paralleldrive/cuid2";

export function seedPlayer(): PlayerDto {
    return {
        id: createId(),
        name: faker.person.firstName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    }
}