import { compareTractors, listTractors } from "@local/common/actions";
import { ActionHandler } from "@local/common/johnapi";
import * as Ef from "effect/Effect";

export const handleListTractors =
  (sessionId: string): ActionHandler<typeof listTractors> =>
  ({ kind }) => {
    return Ef.succeed([
      "John Deere 6789",
      "CaseIH Magnum 380",
      "New Holland 4321",
    ]);
  };

export const handleCompareTractors =
  (sessionId: string): ActionHandler<typeof compareTractors> =>
  ({ kind, a, b }) =>
    Ef.succeed(
      `When looking at the similarities and differences between the ${a} and the ${b}, yadda yadda. In conclusion, the ${a} is better.`
    );
