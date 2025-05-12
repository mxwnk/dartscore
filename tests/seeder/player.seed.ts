import { Player } from "@/prisma/app/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";

export function seedPlayer(): Player {
  return {
    id: createId(),
    name: faker.person.firstName(),
    createdAt: faker.date.past(),
  };
}
