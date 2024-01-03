import express from "express";
import { pipe } from "effect";
import { mkRequestHandler, action } from "@common/john-api";
import {
  handleSignUpUser,
  requestPasswordReset,
  signUpUser,
} from "@common/actions";
import { E } from "../../common/exports";
import { unit } from "@common/utils";

// create the request handler by adding necessary dependencies

const handler = mkRequestHandler([
  action(signUpUser)(handleSignUpUser("dependency here")),
  action(requestPasswordReset)(({ kind, email }) => E.right(unit)),
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
