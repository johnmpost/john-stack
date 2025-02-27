import { useLocation } from "react-router-dom";
import { Callback } from "./Callback";
import { Dash } from "./Dash";
import { useRequirements } from "./requirements";
import { match, P } from "ts-pattern";

export const App = () => {
  const { useUser } = useRequirements();
  const location = useLocation();
  const mustBeAuthenticated = location.pathname !== "/callback";
  const user = useUser(mustBeAuthenticated);

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
