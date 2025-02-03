import { v7 as uuidv7 } from "uuid";
import { createTodo } from "../../src/common/queries";
import { A, Ef, pipe } from "../../src/common/toolbox";
import { faker } from "@faker-js/faker";
import { mkDb } from "../../src/common/layers";

pipe(
  A.range(0, 4),
  A.map(() => ({
    id: uuidv7(),
    title: `${faker.hacker.verb()} the ${faker.hacker.noun()}`,
    description: faker.hacker.phrase(),
    orgId: "291672745513584155",
  })),
  A.map(createTodo),
  Ef.all,
  Ef.provide(mkDb()),
  Ef.runPromise,
);
