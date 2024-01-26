import express from "express";
import { pipe } from "effect";
import { mkRequestHandler, mkAction } from "@common/john-api";
import { compareTractors, listTractors } from "@common/actions";
import { handleCompareTractors, handleListTractors } from "./handlers";

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

app.post("/action", (req, res) =>
  pipe(req.body, JSON.stringify, handler, (x) => res.status(200).json(x))
);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
