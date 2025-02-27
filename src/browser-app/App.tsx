import { useLocation } from "react-router-dom";
import { Callback } from "./Callback";
import { Dash } from "./Dash";
import { useRequirements } from "./requirements";
import { match, P } from "ts-pattern";
import { useQuery as usePromiseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const App = () => {
  const { useUser, zitadel } = useRequirements();
  // const user = useUser();
  const location = useLocation();

  const { data: user } = usePromiseQuery({
    queryKey: ["user"],
    queryFn: () => zitadel.userManager.getUser(),
  });

  useEffect(() => {
    if ((user === null || user?.expired) && location.pathname !== "/callback") {
      zitadel.authorize();
    }
  }, [user]);

  return (
    <div>
      <p>app header</p>
      {match([location.pathname, user])
        .with(["/callback", P._], () => <Callback />)
        .with([P._, undefined], () => <div>loading app...</div>)
        .with([P._, null], () => <div>not logged in. redirecting...</div>)
        .with(["/", P.nonNullable], ([, user]) => <Dash user={user} />)
        .otherwise(() => (
          <div>error 404</div>
        ))}
    </div>
  );
};
