import { Navigate } from "react-router-dom";
import { useAsync } from "react-use";
import { zitadel } from "./exports";

export const Callback = () => {
  const processCallback = useAsync(() =>
    zitadel.userManager.signinRedirectCallback().catch(() => {}),
  );

  return processCallback.loading ? (
    <div>processed login. redirecting...</div>
  ) : (
    <Navigate to="/" />
  );
};
