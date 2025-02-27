import { Navigate } from "react-router-dom";
import { useAsync } from "react-use";
import { useRequirements } from "./requirements";
import { useQueryClient } from "@tanstack/react-query";

export const Callback = () => {
  const { zitadel } = useRequirements();
  const queryClient = useQueryClient();
  const processCallback = useAsync(() =>
    zitadel.userManager
      .signinRedirectCallback()
      .then(user => queryClient.setQueryData(["user"], () => user))
      .catch(() => {}),
  );

  return processCallback.loading ? (
    <div>processed login. redirecting...</div>
  ) : (
    <Navigate to="/" />
  );
};
