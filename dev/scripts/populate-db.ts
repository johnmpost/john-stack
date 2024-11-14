import { v7 as uuidv7 } from "uuid";
import { createTodo } from "../../src/common/queries";
import { A, Ef, pipe } from "../../src/common/toolbox";
import { faker } from "@faker-js/faker";
import * as Pg from "@effect/sql-pg";
import { Config } from "effect";
import { Server } from "../../src/common/config";

const SqlLive = Pg.client.layer(
  pipe(
    Server,
    Config.map(({ dbHost, dbPort, dbName, dbUser, dbPassword }) => ({
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUser,
      password: dbPassword,
    })),
  ),
);

pipe(
  A.range(0, 4),
  A.map(() => ({
    id: uuidv7(),
    title: `${faker.hacker.verb()} the ${faker.hacker.noun()}`,
    description: faker.hacker.phrase(),
    orgid: "291672745513584155",
  })),
  A.map(createTodo),
  Ef.all,
  Ef.provide(SqlLive),
  Ef.runPromise,
);
