import { Navigate } from "react-router-dom";
import { useAsync } from "react-use";
import { useRequirements } from "./requirements";

export const Callback = () => {
  const { zitadel } = useRequirements();
  const processCallback = useAsync(() =>
    zitadel.userManager.signinRedirectCallback().catch(() => {}),
  );

  return processCallback.loading ? (
    <div>processed login. redirecting...</div>
  ) : (
    <Navigate to="/" />
  );
};
