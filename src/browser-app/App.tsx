import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Callback } from "./Callback";
import { Dash } from "./Dash";
import { useRequirements } from "./requirements";
import { match } from "ts-pattern";

export const App = () => {
  const { useUser } = useRequirements();
  const user = useUser();

  return (
    <div>
      <p>app header</p>

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={match(user)
              .with(undefined, () => <div>loading app...</div>)
              .with(null, () => <div>not logged in. redirecting...</div>)
              .otherwise(user => (
                <Dash user={user} />
              ))}
          />
          <Route path="/test" element={<div>this is the test page</div>} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
