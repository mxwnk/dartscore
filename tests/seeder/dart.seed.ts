import { Dart } from "@/app/models/dart";
import { faker } from "@faker-js/faker";

export function randomDart(): Dart {
  return {
    score: faker.number.int({ min: 1, max: 20 }),
    ring: faker.helpers.arrayElement(["D", "T", undefined]),
  };
}