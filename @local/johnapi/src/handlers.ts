import { signUpUser } from "@common/actions";
import { ActionHandler } from "@common/john-api";
import { E } from "../../common/exports";
import { unit } from "@common/utils";

export const handleSignUpUser =
  (someDependency: any): ActionHandler<typeof signUpUser> =>
  ({ kind, email, password }) =>
    E.right(unit);
