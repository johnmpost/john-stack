import { listTractors, compareTractors } from "@common/actions";
import { ActionHandler } from "@common/john-api";
import { E } from "../../common/exports";
import { unit } from "@common/utils";

export const handleListTractors =
  (sessionId: string): ActionHandler<typeof listTractors> =>
  ({ kind }) =>
    ["John Deere 6789", "CaseIH Magnum 380", "New Holland 4321"];

export const handleCompareTractors =
  (sessionId: string): ActionHandler<typeof compareTractors> =>
  ({ kind, a, b }) =>
    `When looking at the similarities and differences between the ${a} and the ${b}, yadda yadda. In conclusion, the ${a} is better.`;
