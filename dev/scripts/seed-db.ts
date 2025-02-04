import { v7 as uuidv7 } from "uuid";
import { createTodo } from "../../src/common/queries";
import { A, Ef, pipe } from "../../src/common/toolbox";
import { faker } from "@faker-js/faker";
import { mkDb } from "../../src/common/layers";
import { Config, ConfigProvider, Layer } from "effect";

const config = pipe(
  Config.all({
    johnStackCoId: Config.string("JOHN_STACK_CO_ID"),
    wayneEnterprisesId: Config.string("WAYNE_ENTERPRISES_ID"),
    johnPostId: Config.string("JOHN_POST_ID"),
    bruceWayneId: Config.string("BRUCE_WAYNE_ID"),
    alfredPennyworthId: Config.string("ALFRED_PENNYWORTH_ID"),
  }),
  Ef.provide(Layer.setConfigProvider(ConfigProvider.fromEnv())),
  Ef.runSync,
);

pipe(
  A.range(0, 4),
  A.map(() => ({
    id: uuidv7(),
    title: `${faker.hacker.verb()} the ${faker.hacker.noun()}`,
    description: faker.hacker.phrase(),
    orgId: config.johnStackCoId,
  })),
  A.map(createTodo),
  Ef.all,
  Ef.provide(mkDb()),
  Ef.runPromise,
);
