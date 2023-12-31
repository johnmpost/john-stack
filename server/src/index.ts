import express from "express";
import { pipe } from "./exports";
import { endpoint } from "./john-api";
import { actions } from "./actions";

const port = 4000;
const app = express();

app.use(express.json());

app.post("/action", (req, res) =>
  pipe(req.body, JSON.stringify, endpoint(actions), (x) =>
    res.status(200).json(x)
  )
);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
