import express from "express";
import { pipe } from "effect";
import { mkRequestHandler, mkAction } from "@common/john-api";
import { compareTractors, listTractors } from "@common/actions";
import { handleCompareTractors, handleListTractors } from "./handlers";
import { Ef } from "../../common/exports";
import { Request, Response } from "express";

// create the request handler by adding necessary dependencies

const sessionId = "get from async login endpoint";

const handler = mkRequestHandler([
  mkAction(listTractors)(handleListTractors(sessionId)),
  mkAction(compareTractors)(handleCompareTractors(sessionId)),
]);

// use it in any http server or cloud function platform

const port = 4000;
const app = express();
app.use(express.json());

const expressHandler = async (req: Request, res: Response) =>
  await pipe(
    req.body,
    JSON.stringify,
    handler,
    Ef.map((x) => res.status(200).json(x)),
    Ef.runPromise
  );

app.post("/action", expressHandler);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
